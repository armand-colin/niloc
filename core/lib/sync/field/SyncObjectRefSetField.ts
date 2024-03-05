import { SyncObject } from "../SyncObject";
import { Reader } from "../../serialize/Reader";
import { Writer } from "../../serialize/Writer";
import { Field } from "./Field";

export class SyncObjectRefSetField<T extends SyncObject> extends Field<T[]> {

    private _objects = new Map<string, T | null>()

    add(object: T) {
        this._objects.set(object.id, object)
        this.changed()
    }

    remove(object: T) {
        this._objects.delete(object.id)
        this.changed()
    }

    has(object: T): boolean {
        return this._objects.has(object.id)
    }

    get(): T[] {
        return [...this._objects.values()].filter((object): object is T => !!object)
    }

    set(objects: T[]) {
        this._objects.clear()
        for (const object of objects)
            this._objects.set(object.id, object)

        this.changed()
    }

    *values(): IterableIterator<T> {
        for (const object of this._objects.values())
            if (object !== null)
                yield object
    }

    read(reader: Reader): void {
        const count = reader.readU16()
        this._objects.clear()
        for (let i = 0; i < count; i++) {
            const objectId = reader.readString()
            this._objects.set(objectId, this.model.get(objectId))
        }
        this.emit('change', this.get())
    }

    write(writer: Writer): void {
        writer.writeU16(this._objects.size)
        for (const objectId of this._objects.keys())
            writer.writeString(objectId)
    }

    protected onInit(): void {
        this.model.on('created', object => {
            const objectId = object.id
            if (this._objects.has(objectId))
                this._objects.set(objectId, object as T)
            this.emit('change', this.get())
        })
    }

}