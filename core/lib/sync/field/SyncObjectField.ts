import { StringWriter } from "../../tools/StringWriter";
import { SyncObject } from "../SyncObject";
import { SyncObjectType } from "../SyncObjectType";
import { Field } from "./Field";
import { Reader } from "../../serialize/Reader";
import { Writer } from "../../serialize/Writer";

export class SyncObjectField<T extends SyncObject> extends Field<T> {

    private _object: T
    private _changes: number[] = []

    constructor(type: SyncObjectType<T>, id?: string) {
        super()
        this._object = new type(id ?? "sub")
    }

    get(): T {
        return this._object
    }

    set(value: T): void {
        this._object = value
        this.changed()
    }

    read(reader: Reader): void {
        SyncObject.read(this._object, reader)
        this.emit('change', this.get())
    }

    write(writer: Writer): void {
        SyncObject.write(this._object, writer)
    }

    readDelta(reader: Reader): void {
        const count = reader.readU8()
        for (let i = 0; i < count; i++) {
            const fieldIndex = reader.readU8()
            Field.readDelta(this._object.fields()[fieldIndex], reader)
        }
        this.emit('change', this.get())
    }

    writeDelta(writer: Writer): void {
        const count = this._changes.length
        writer.writeU8(count)
        for (const fieldIndex of this._changes) {
            writer.writeU8(fieldIndex)
            Field.writeDelta(this._object.fields()[fieldIndex], writer)
        }
    }

    resetDelta(): void {
        for (const fieldIndex of this._changes)
            Field.resetDelta(this._object.fields()[fieldIndex])
        this._changes = []
    }

    protected onInit(): void {
        super.onInit()

        SyncObject.__init(this._object, {  model: this.model })
    }

    protected toString(writer: StringWriter): void {
        SyncObject.writeString(this._object, writer)
    }

}