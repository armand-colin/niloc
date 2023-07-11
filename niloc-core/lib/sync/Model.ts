import { Template } from "./Template"
import { SyncObject } from "./SyncObject"
import { Channel } from "../channel/Channel"
import { nanoid } from "nanoid"
import { ChangeRequester } from "./Synchronize"
import { ModelHandle } from "./ModelHandle"
import { ChangeQueue } from "./ChangeQueue"
import { Reader } from "./Reader"
import { Writer } from "./Writer"
import { Plugin } from "./Plugin"
import { Context } from "../core/Context"
import { Authority } from "./Authority"
import { Emitter } from "@niloc/utils"
import { Address } from "../core/Address"
import { Message } from "../core/Message"

export interface ModelEvents {
    created: SyncObject
}

export interface Model {

    emitter(): Emitter<ModelEvents>
    register(template: Template<SyncObject>): void
    plugin(plugin: Plugin): void
    instantiate<T extends SyncObject>(template: Template<T>, id?: string): T
    tick(): void
    syncTo(address: Address): void

}

type ModelData =
    { type: "change", changes: string[] } |
    { type: "sync", changes: string[] }

interface ModelOpts {
    context: Context,
    channel: Channel<ModelData>,
}

export class Model {

    private _channel: Channel<ModelData>
    private _context: Context

    private _emitter = new Emitter<ModelEvents>()
    private _objectsEmitter = new Emitter<{ [key: string]: SyncObject | null }>()

    private _templates = new Map<string, Template<SyncObject>>()
    private _objects = new Map<string, SyncObject>()

    private _handle: ModelHandle

    private _changeQueue = new ChangeQueue()

    private _reader = new Reader()
    private _writer = new Writer()

    private _plugins = [] as Plugin[]

    constructor(opts: ModelOpts) {
        this._channel = opts.channel
        this._channel.addListener(this._onMessage)

        this._context = opts.context

        this._handle = ModelHandle.make({
            emitter: this._emitter,
            objectsEmitter: this._objectsEmitter,
            get: (id) => this.get(id),
        })
    }

    emitter() { return this._emitter }

    plugin(plugin: Plugin) {
        this._plugins.push(plugin)
    }

    register(template: Template<SyncObject>) {
        this._templates.set(template.type, template)
    }

    instantiate<T extends SyncObject>(template: Template<T>, id?: string): T {
        const objectId = id ?? nanoid()
        const object = this._create(template, objectId)

        this._changeQueue.sync(objectId)

        return object
    }

    tick() {
        const syncs = this._collectSyncs()
        const changes = this._collectChanges()

        if (syncs.length > 0)
            this._channel.post(Address.broadcast(), { type: "sync", changes: syncs })

        if (changes.length > 0)
            this._channel.post(Address.broadcast(), { type: "change", changes: changes })
    }

    syncTo(address: Address) {
        const syncs = this._collectGlobalSyncs()
        if (syncs.length > 0)
            this._channel.post(address, { type: "sync", changes: syncs })
    }

    get<T extends SyncObject>(id: string): T | null {
        return (this._objects.get(id) as T | undefined) ?? null
    }

    getAll() {
        return [...this._objects.values()]
    }

    private _create<T extends SyncObject>(template: Template<T>, id: string) {
        const object = template.create(id)
        SyncObject.setChangeRequester(object, this._makeChangeRequester(id))
        SyncObject.setModelHandle(object, this._handle)
        this._objects.set(id, object)

        for (const plugin of this._plugins)
            plugin.beforeCreate?.(object)

        this._emitter.emit('created', object)
        this._objectsEmitter.emit(id, object)

        return object
    }

    private _makeChangeRequester(id: string): ChangeRequester {
        return {
            change: (index) => this._onChangeRequest(id, index)
        }
    }

    private _onChangeRequest(id: string, fieldIndex: number) {
        this._changeQueue.change(id, fieldIndex)
    }

    private _collectGlobalSyncs(): any[] {
        return this._collectSyncsForObjects(this._objects.keys())
    }

    private _collectSyncs(): any[] {
        return this._collectSyncsForObjects(this._changeQueue.syncs())
    }

    private _collectSyncsForObjects(objectIds: Iterable<string>): any[] {
        const writer = this._writer;

        for (const objectId of objectIds) {
            const object = this._objects.get(objectId)
            if (!object)
                continue

            const template = this._templates.get(object.type())
            if (!template)
                continue

            if (!Authority.allows(template.authority, object, this._context))
                continue

            writer.writeString(object.id())
            writer.writeString(object.type())
            object.write(writer)
        }

        return writer.collect()
    }

    private _collectChanges(): any[] {
        const writer = this._writer

        for (const { objectId, fields } of this._changeQueue.changes()) {
            const object = this._objects.get(objectId)
            if (!object)
                continue

            const template = this._templates.get(object.type())
            if (!template)
                continue

            if (!Authority.allows(template.authority, object, this._context))
                continue

            writer.writeString(objectId)
            writer.writeInt(fields.length)
            const head = writer.cursor()
            writer.writeInt(0)

            for (const index of fields) {
                const field = object.fields()[index]
                writer.writeInt(index)
                field.writeChange(writer)
            }

            const tail = writer.cursor()
            writer.setCursor(head)
            writer.writeInt(tail - head - 1)
            writer.resume()
        }

        return writer.collect()
    }

    private _onMessage = (message: Message<ModelData>) => {
        switch (message.data.type) {
            case 'sync': {
                this._onSync(message.data.changes)
                break
            }
            case 'change': {
                this._onChange(message.data.changes)
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
            const type = reader.readString()

            let object = this._objects.get(objectId)

            if (object) {
                object.read(reader)
                continue
            }

            const template = this._templates.get(type)
            if (!template) {
                console.error('Could not create object with type', type)
                return
            }

            object = this._create(template, objectId)
            object.read(reader)
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
                object.fields()[fieldIndex].readChange(reader)
            }
        }
    }

}
