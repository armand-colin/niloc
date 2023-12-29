import { SyncObject } from "./SyncObject"
import { Channel } from "../channel/Channel"
import { nanoid } from "nanoid"
import { ChangeRequester } from "./Synchronize"
import { ChangeQueue } from "./ChangeQueue"
import { Reader } from "./Reader"
import { Writer } from "./Writer"
import { Plugin } from "./Plugin"
import { Context } from "../core/Context"
import { Authority } from "./Authority"
import { Emitter, IEmitter } from "@niloc/utils"
import { Address } from "../core/Address"
import { Message } from "../core/Message"
import { TypesHandler } from "./TypesHandler"
import { SyncObjectType } from "./SyncObjectType"
import { ModelEvents, Model as IModel, ObjectRequest } from "./Model.interface"
import { Field } from "./field/Field"

type ObjectId = string
type TypeId = string

type ModelData =
    [ModelMessageType.Change, ...string[]] |
    [ModelMessageType.Sync, ...string[]] |
    [ModelMessageType.Instantiate, ObjectId, TypeId]

interface ModelOpts {
    context: Context,
    channel: Channel<ModelData>,
}

enum ModelMessageType {
    Sync = 0,
    Change = 1,
    Instantiate = 2
}

export class Model implements IModel {

    private _channel: Channel<ModelData>
    private _context: Context

    private _emitter = new Emitter<ModelEvents>()
    private _objectsEmitter = new Emitter<{ [key: string]: SyncObject | null }>()

    private _typesHandler = new TypesHandler()
    private _objects = new Map<string, SyncObject>()

    private _changeQueue = new ChangeQueue()

    private _reader = new Reader()
    private _writer = new Writer()

    private _plugins = [] as Plugin[]

    constructor(opts: ModelOpts) {
        this._channel = opts.channel
        this._channel.addListener(this._onMessage)

        this._context = opts.context
    }

    emitter(): IEmitter<ModelEvents> { return this._emitter }
    changeQueue() { return this._changeQueue }

    /**
     * @deprecated Use `addPlugin` instead
     */
    plugin(plugin: Plugin): void {
        this.addPlugin(plugin)
    }

    addPlugin(plugin: Plugin): this {
        this._plugins.push(plugin)
        plugin.init?.(this)
        return this
    }

    register<T extends SyncObject>(type: SyncObjectType<T>, typeId?: string) {
        this._typesHandler.register(type, typeId)
    }

    instantiate<T extends SyncObject>(type: SyncObjectType<T>, id?: string): T {
        const objectId = id ?? nanoid()
        const object = this._create(type, objectId)

        if (Authority.allows(object, this._context)) {
            const typeId = this._typesHandler.getTypeId(object)
            if (typeId === null)
                throw new Error('Error while instantiating object: Type not registered')

            this._channel.post(Address.broadcast(), [
                ModelMessageType.Instantiate,
                objectId,
                typeId
            ])
        }

        return object
    }

    send(objectId?: string) {
        const writer = this._writer
        
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

        const changes = writer.collect()
        if (changes.length === 0)
            return

        this._channel.post(Address.broadcast(), [ModelMessageType.Change, ...changes])
    }

    private _writeChangesForObject(object: SyncObject, writer: Writer) {
        if (!Authority.allows(object, this._context))
            return

        if (!SyncObject.isDirty(object))
            return

        const dirtyFields = SyncObject.getDirtyFields(object)
        if (dirtyFields.length === 0)
            return

        writer.writeString(object.id())
        writer.writeInt(object.fields().length)

        const head = writer.cursor()
        writer.writeInt(0)

        for (const field of dirtyFields) {
            writer.writeInt(field.index())
            Field.writeDelta(field, writer)
            Field.resetDelta(field)
        }

        const tail = writer.cursor()
        writer.setCursor(head)
        writer.writeInt(tail - head - 1)
        writer.resume()
    }

    syncTo(address: Address) {
        const writer = this._writer

        for (const object of this._objects.values()) {
            if (!Authority.allows(object, this._context))
                continue

            const typeId = this._typesHandler.getTypeId(object)
            if (typeId === null)
                continue

            writer.writeString(object.id())
            writer.writeString(typeId)
            SyncObject.write(object, writer)
        }

        const changes = writer.collect()

        if (changes.length === 0)
            return

        this._channel.post(address, [ModelMessageType.Sync, ...changes])
    }

    get<T extends SyncObject>(id: string): T | null {
        return (this._objects.get(id) as T | undefined) ?? null
    }

    getAll() {
        return [...this._objects.values()]
    }

    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ObjectRequest {
        this._objectsEmitter.on(id, callback)
        callback(this.get(id))

        const request: ObjectRequest = {
            dispose: () => {
                this._objectsEmitter.off(id, callback)
            }
        }

        return request
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

        this._emitter.emit('created', object)
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
        this._emitter.emit('deleted', id)
        this._objectsEmitter.emit(id, null)
    }

    private _onMessage = (message: Message<ModelData>) => {
        switch (message.data[0]) {
            case ModelMessageType.Instantiate: {
                const objectId = message.data[1]
                const typeId = message.data[2]
                const type = this._typesHandler.getType(typeId)
                if (!type) {
                    console.error('Could not create object with type', typeId)
                    return
                }

                this._create(type, objectId)
                break
            }
            case ModelMessageType.Sync: {
                this._onSync(message.data.slice(1) as string[])
                break
            }
            case ModelMessageType.Change: {
                this._onChange(message.data.slice(1) as string[])
                break
            }
        }
    }

    private _onSync(changes: string[]) {
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

    private _onChange(changes: string[]) {
        const reader = this._reader
        reader.feed(changes)

        while (true) {
            if (reader.empty())
                break

            const objectId = reader.readString()
            const fieldCount = reader.readInt()
            const changeCount = reader.readInt()

            const object = this._objects.get(objectId)

            if (!object) {
                // TODO: Ask sync for object
                reader.skip(changeCount)
                continue
            }

            for (let i = 0; i < fieldCount; i++) {
                const fieldIndex = reader.readInt()
                Field.readDelta(object.fields()[fieldIndex], reader)
            }
        }
    }

}