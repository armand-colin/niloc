import { SyncObject } from "./SyncObject"
import { Channel } from "../channel/Channel"
import { nanoid } from "nanoid"
import { ChangeRequester } from "./ChangeRequester"
import { ChangeQueue } from "./ChangeQueue"
import { Plugin } from "./Plugin"
import { Identity } from "../core/Identity"
import { Authority } from "./Authority"
import { Emitter } from "@niloc/utils"
import { Address } from "../core/Address"
import { Message } from "../core/Message"
import { TypesHandler } from "./TypesHandler"
import { SyncObjectType } from "./SyncObjectType"
import { Field } from "./field/Field"
import { BinaryReader } from "../serialize/BinaryReader"
import { BinaryWriter } from "../serialize/BinaryWriter"
import { staticImplements } from "../tools/staticImplements"
import { Deserializer } from "../serialize/Deserializer"
import { Serializable } from "../serialize/Serializable"

type ModelMessageData = {
    type: ModelMessageType.Change,
    changes: Uint8Array
} | {
    type: ModelMessageType.Sync,
    buffer: Uint8Array
} | {
    type: ModelMessageType.Instantiate,
    objectId: string,
    typeId: string
}

@staticImplements<Deserializer<ModelMessage>>()
class ModelMessage implements Serializable {

    constructor(readonly data: ModelMessageData) { }

    serialize(writer: BinaryWriter): void {
        writer.writeU8(this.data.type)

        switch (this.data.type) {
            case ModelMessageType.Sync: {
                writer.writeU(this.data.buffer.length)
                writer.write(this.data.buffer)
                break
            }
            case ModelMessageType.Change: {
                writer.writeU(this.data.changes.length)
                writer.write(this.data.changes)
                break
            }
            case ModelMessageType.Instantiate: {
                writer.writeString(this.data.objectId)
                writer.writeString(this.data.typeId)
                break
            }
        }
    }

    static deserialize(reader: BinaryReader): ModelMessage {
        const type = reader.readU8()

        switch (type) {
            case ModelMessageType.Change: {
                const length = reader.readU()
                const changes = reader.read(length)
                return new ModelMessage({ type, changes })
            }
            case ModelMessageType.Sync: {
                const length = reader.readU()
                const buffer = reader.read(length)
                return new ModelMessage({ type, buffer })
            }
            case ModelMessageType.Instantiate: {
                const objectId = reader.readString()
                const typeId = reader.readString()
                return new ModelMessage({ type, objectId, typeId })
            }
        }

        throw new Error(`Unknown message type: ${type}`)
    }

}

interface ModelOpts {
    identity: Identity,
    channel: Channel<ModelMessage>,
}

enum ModelMessageType {
    Sync = 0,
    Change = 1,
    Instantiate = 2
}

interface ModelEvents {
    created: SyncObject,
    deleted: string
}

export class Model extends Emitter<ModelEvents> {

    private _channel: Channel<ModelMessage>
    private _identity: Identity

    private _objectsEmitter = new Emitter<{ [key: string]: SyncObject | null }>()

    private _typesHandler = new TypesHandler()
    private _objects = new Map<string, SyncObject>()

    private _changeQueue = new ChangeQueue()

    private _reader = new BinaryReader()
    private _writer = new BinaryWriter()

    private _plugins = [] as Plugin[]

    constructor(opts: ModelOpts) {
        super()

        this._channel = opts.channel
        this._channel.addListener(this._onMessage)

        this._identity = opts.identity
    }

    get changeQueue() {
        return this._changeQueue
    }

    get identity() {
        return this._identity
    }

    addPlugin(plugin: Plugin): this {
        this._plugins.push(plugin)
        plugin.init?.(this)
        return this
    }

    addType<T extends SyncObject>(type: SyncObjectType<T>, typeId?: string): this {
        this._typesHandler.register(type, typeId)
        return this
    }

    instantiate<T extends SyncObject>(type: SyncObjectType<T>, id?: string): T {
        const objectId = id ?? nanoid()
        const object = this._create(type, objectId)

        if (Authority.allows(object, this._identity)) {
            const typeId = this._typesHandler.getTypeId(object)

            if (typeId === null)
                throw new Error('Error while instantiating object: Type not registered')

            this._channel.post({
                data: new ModelMessage({
                    type: ModelMessageType.Instantiate,
                    objectId: objectId,
                    typeId: typeId
                }),
                address: Address.broadcast()
            })
        }

        return object
    }

    send(objectId?: string) {
        const writer = this._writer
        writer.clear()

        if (objectId !== undefined) {
            const object = this._objects.get(objectId)
            if (!object)
                return

            this._writeChangesForObject(object, writer)
            this._changeQueue.deleteChange(objectId)
        } else {
            for (const objectId of this._changeQueue.changes()) {
                const object = this._objects.get(objectId)
                if (!object)
                    continue

                this._writeChangesForObject(object, writer)
            }
            this._changeQueue.clear()
        }

        if (writer.cursor() === 0)
            return

        this._channel.post({
            address: Address.broadcast(),
            data: new ModelMessage({
                type: ModelMessageType.Change,
                changes: writer.collect()
            })
        })
    }

    sync(address: Address) {
        const writer = this._writer
        writer.clear()

        for (const object of this._objects.values()) {
            if (!Authority.allows(object, this._identity))
                continue

            const typeId = this._typesHandler.getTypeId(object)
            if (typeId === null)
                continue

            writer.writeString(object.id)
            writer.writeString(typeId)
            SyncObject.write(object, writer)
        }

        if (writer.cursor() === 0)
            return // Wrote nothing

        this._channel.post({
            address,
            data: new ModelMessage({
                type: ModelMessageType.Sync,
                buffer: writer.collect()
            })
        })
    }

    get<T extends SyncObject>(id: string): T | null {
        return (this._objects.get(id) as T | undefined) ?? null
    }

    getAll() {
        return [...this._objects.values()]
    }

    registerObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): void {
        this._objectsEmitter.on(id, callback as (object: SyncObject | null) => void)
        callback(this.get(id))
    }

    unregisterObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): void {
        this._objectsEmitter.off(id, callback as (object: SyncObject | null) => void)
    }

    private _create<T extends SyncObject>(type: SyncObjectType<T>, id: string) {
        const object = new type(id)
        this._objects.set(id, object)

        SyncObject.__init(object, {
            changeRequester: this._makeChangeRequester(id),
            model: this
        })

        for (const plugin of this._plugins)
            plugin.beforeCreate?.(object)

        this.emit('created', object)
        this._objectsEmitter.emit(id, object)

        return object
    }

    private _makeChangeRequester(id: string): ChangeRequester {
        return {
            change: () => this._onChangeRequest(id),
            send: () => this.send(id),
            delete: () => this._delete(id),
        }
    }

    private _onChangeRequest(id: string) {
        this._changeQueue.addChange(id)
    }

    private _delete(id: string) {
        if (!this._objects.has(id))
            return

        this._objects.delete(id)
        this.emit('deleted', id)
        this._objectsEmitter.emit(id, null)
    }

    private _onMessage = (message: Message<ModelMessage>) => {
        const modelMessage = message.deserialize(ModelMessage)

        switch (modelMessage.data.type) {
            case ModelMessageType.Instantiate: {
                const objectId = modelMessage.data.objectId
                const typeId = modelMessage.data.typeId

                const type = this._typesHandler.getType(typeId)
                if (!type) {
                    console.error('Could not create object with type', typeId)
                    return
                }

                this._create(type, objectId)
                break
            }
            case ModelMessageType.Sync: {
                this._onSync(modelMessage.data.buffer)
                break
            }
            case ModelMessageType.Change: {
                this._onChange(modelMessage.data.changes)
                break
            }
        }
    }

    private _onSync(changes: Uint8Array) {
        const reader = this._reader
        reader.feed(changes)

        while (true) {
            if (reader.empty())
                break

            const objectId = reader.readString()
            const typeId = reader.readString()

            let object = this._objects.get(objectId)

            if (object) {
                SyncObject.read(object, reader)
                continue
            }

            const type = this._typesHandler.getType(typeId)
            if (!type) {
                console.error('Could not create object with type', typeId)
                return
            }

            object = this._create(type, objectId)
            SyncObject.read(object, reader)
        }
    }

    private _onChange(changes: Uint8Array) {
        const reader = this._reader
        reader.feed(changes)

        while (true) {
            if (reader.empty())
                break

            const objectId = reader.readString()
            const fieldCount = reader.readU8()
            const changeCount = reader.readU32()

            const object = this._objects.get(objectId)

            if (!object) {
                // TODO: Ask sync for object
                reader.skip(changeCount)
                continue
            }

            for (let i = 0; i < fieldCount; i++) {
                const fieldIndex = reader.readU8()
                Field.readDelta(object.fields()[fieldIndex], reader)
            }
        }
    }

    private _writeChangesForObject(object: SyncObject, writer: BinaryWriter) {
        if (!Authority.allows(object, this._identity))
            return

        if (!SyncObject.isDirty(object))
            return

        const dirtyFields = SyncObject.getDirtyFields(object)
        if (dirtyFields.length === 0)
            return

        writer.writeString(object.id)
        writer.writeU8(dirtyFields.length)

        const head = writer.cursor()
        writer.writeU32(0)

        for (const field of dirtyFields) {
            writer.writeU8(field.index)
            Field.writeDelta(field, writer)
            Field.resetDelta(field)
        }

        const tail = writer.cursor()
        writer.setCursor(head)
        writer.writeU32(tail - head - 1)
        writer.resume()
    }

}