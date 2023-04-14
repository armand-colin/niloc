import { Template } from "./Template"
import { SyncObject } from "./SyncObject"
import { Channel } from "../channel/DataChannel"
import { nanoid } from "nanoid"
import { ChangeRequester, ModelChangeReader, ModelChangeWriter, ModelSyncReader, ModelSyncWriter } from "./Synchronize"
import { Address, Message } from "../main"
import { Emitter } from "utils"
import { ModelHandle } from "./ModelHandle"
import { ChangeQueue } from "./ChangeQueue"

export interface ModelEvents {
    created: SyncObject
}

export interface Model {

    emitter(): Emitter<ModelEvents>
    register(template: Template<SyncObject>): void
    instantiate<T extends SyncObject>(template: Template<T>): T
    tick(): void

}

type ModelData =
    { type: "change", changes: string[] } |
    { type: "sync", changes: string[] }

/**
 * Sync
 * [objectId, type, field1, field2, field3..., objectId, type, ....]
 * 
 * Change
 * [objectId, nFields, If1, f1, If2, f2...]
 * 
 */

interface ModelOpts {
    channel: Channel<ModelData>,
    sync: {
        reader: ModelSyncReader,
        writer: ModelSyncWriter
    },
    change: {
        reader: ModelChangeReader,
        writer: ModelChangeWriter
    }
}

export class Model {

    private _channel: Channel<ModelData>

    private _emitter = new Emitter<ModelEvents>()
    private _objectsEmitter = new Emitter<{ [key: string]: SyncObject | null }>()

    private _templates = new Map<string, Template<SyncObject>>()
    private _objects = new Map<string, SyncObject>()

    private _handle: ModelHandle

    private _changeQueue = new ChangeQueue()

    private _opts: ModelOpts

    constructor(opts: ModelOpts) {
        this._channel = opts.channel
        this._channel.addListener(this._onMessage)

        this._opts = opts

        this._handle = ModelHandle.make({
            emitter: this._emitter,
            objectsEmitter: this._objectsEmitter,
            get: (id) => this.get(id),
        })
    }

    emitter() { return this._emitter }

    register(template: Template<SyncObject>) {
        this._templates.set(template.type, template)
    }

    instantiate<T extends SyncObject>(template: Template<T>, id?: string): T {
        const objectId = id ?? nanoid()
        const object = this._create(template, objectId)

        this._changeQueue.sync(objectId)

        this._emitter.emit('created', object)

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

    private _collectSyncs(): any[] {
        console.log('collect syncs', this._changeQueue);
        
        for (const objectId of this._changeQueue.syncs()) {
            const object = this._objects.get(objectId)
            if (!object)
                continue

            this._opts.sync.writer.start(object.id(), object.type())
            object.write(this._opts.sync.writer)
        }

        return this._opts.sync.writer.collect()
    }

    private _collectChanges(): any[] {
        for (const { objectId, fields } of this._changeQueue.changes()) {
            const object = this._objects.get(objectId)
            if (!object)
                continue
            
            this._opts.change.writer.start(objectId, fields.length)

            for (const index of fields) {
                const field = object.fields()[index]
                this._opts.change.writer.field(index)
                field.writeChange(this._opts.change.writer)
            }
            
            this._opts.change.writer.end()
        }
        return this._opts.change.writer.collect()
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
        console.log('sync', changes);

        const reader = this._opts.sync.reader
        reader.feed(changes)

        while (true) {
            const payload = reader.start()

            if (!payload)
                break

            const { objectId, type } = payload
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
        console.log('change', changes)

        const reader = this._opts.change.reader
        reader.feed(changes)

        while (true) {
            const payload = reader.start()
            if (!payload)
                break

            console.log('payload', payload);
            
            const object = this._objects.get(payload.objectId)
            if (!object) {
                reader.skip()
                continue
            }

            for (let i = 0; i < payload.fieldCount; i++) {
                const fieldIndex = reader.field()
                object.fields()[fieldIndex].readChange(reader)
            }
        }
    }

}
