import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { Writer } from "../Writer";
import { Field } from "./Field";

export class SyncObjectRefSetField<T extends SyncObject> extends Field {

    private _objects = new Map<string, T | null>()
    private _modelHandle: ModelHandle | null = null

    add(object: T) {
        this._objects.set(object.id(), object)
        this.changed()
    }

    remove(object: T) {
        this._objects.delete(object.id())
        this.changed()
    }

    has(object: T): boolean {
        return this._objects.has(object.id())
    }

    *values(): IterableIterator<T> {
        for (const object of this._objects.values())
            if (object !== null)
                yield object
    }

    read(reader: Reader): void {
        const count = reader.readInt()
        this._objects.clear()
        for (let i = 0; i < count; i++) {
            const objectId = reader.readString()
            this._objects.set(objectId, this._modelHandle?.get(objectId) ?? null)
        }
        this.emitter().emit('changed')
    }

    write(writer: Writer): void {
        writer.writeInt(this._objects.size)
        for (const objectId of this._objects.keys())
            writer.writeString(objectId)
    }

    protected onModelHandle(handle: ModelHandle): void {
        this._modelHandle = handle
        this._modelHandle.emitter().on('created', object => {
            const objectId = object.id()
            if (this._objects.has(objectId))
                this._objects.set(objectId, object as T)
            this.emitter().emit('changed')
        })
    }

}