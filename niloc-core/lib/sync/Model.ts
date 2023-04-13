import { Template } from "./Template"
import { SyncObject } from "./SyncObject"
import { Channel } from "../channel/DataChannel"
import { nanoid } from "nanoid"
import { ChangeRequester, ModelReader, ModelWriter } from "./Synchronize"
import { Address, Message } from "../main"
import { Emitter } from "utils"

interface ModelEvents {
    created: SyncObject
}

export interface Model {

    emitter(): Emitter<ModelEvents>
    register(template: Template<SyncObject>): void
    instantiate<T extends SyncObject>(template: Template<T>): T
    tick(): void

}

type ModelData = { type: "write", changes: string[] }

interface ModelOpts {
    channel: Channel<ModelData>,
    reader: ModelReader,
    writer: ModelWriter
}

export class Model {

    private _channel: Channel<ModelData>

    private _emitter = new Emitter<ModelEvents>()
    private _templates = new Map<string, Template<SyncObject>>()
    private _objects = new Map<string, SyncObject>()

    private _changeQueue = new Set<string>()

    private _reader: ModelReader
    private _writer: ModelWriter

    constructor(opts: ModelOpts) {
        this._channel = opts.channel
        this._channel.addListener(this._onMessage)

        this._reader = opts.reader
        this._writer = opts.writer
    }

    emitter() { return this._emitter }

    register(template: Template<SyncObject>) {
        this._templates.set(template.type, template)
    }

    instantiate<T extends SyncObject>(template: Template<T>, id?: string): T {
        const objectId = id ?? nanoid()
        const object = this._create(template, objectId)

        this._objects.set(objectId, object)
        this._changeQueue.add(objectId)
        
        this._emitter.emit('created', object)
        
        return object
    }

    tick() {
        const changes = this._collectChanges()
        if (changes.length > 0)
            this._channel.post(Address.broadcast(), { type: "write", changes })
    }

    private _create<T extends SyncObject>(template: Template<T>, id: string) {
        const object = template.create(id)
        SyncObject.setChangeRequester(object, this._makeChangeRequester(id))
        return object
    }

    private _makeChangeRequester(id: string): ChangeRequester {
        return { change: () => this._onChange(id) }
    }

    private _onChange(id: string) {
        this._changeQueue.add(id)
    }

    private _collectChanges(): any[] {
        if (this._changeQueue.size === 0)
            return []

        for (const id of this._changeQueue) {
            const object = this._objects.get(id)
            if (!object)
                continue

            this._writer.start(object.id(), object.type())
            object.write(this._writer)
            this._writer.end()
        }

        return this._writer.collect()
    }

    private _onMessage = (message: Message<ModelData>) => {
        switch (message.data.type) {
            case 'write': {
                this._onWrite(message.data.changes)
                break
            }
        }
    }

    private _onWrite(changes: string[]) {
        this._reader.feed(changes)

        while (true) {
            const payload = this._reader.start()

            if (!payload)
                break

            const { objectId, type } = payload
            let object = this._objects.get(objectId)

            if (object) {
                object.read(this._reader)
                continue
            }

            const template = this._templates.get(type)
            if (!template) {
                console.error('Could not create object with type ', type)
                return
            }

            object = this._create(template, objectId)
            object.read(this._reader)
        }
    }

}
