import { StringWriter } from "../../tools/StringWriter";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { SyncObjectType } from "../SyncObjectType";
import { ChangeRequester } from "../ChangeRequester";
import { Writer } from "../Writer";
import { Field } from "./Field";

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
        const count = reader.readInt() as number
        for (let i = 0; i < count; i++) {
            const fieldIndex = reader.readInt()
            Field.readDelta(this._object.fields()[fieldIndex], reader)
        }
        this.emit('change', this.get())
    }

    writeDelta(writer: Writer): void {
        const count = this._changes.length
        writer.writeInt(count)
        for (const fieldIndex of this._changes) {
            writer.writeInt(fieldIndex)
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

        const changeRequester: ChangeRequester = {
            change: (fieldIndex) => {
                this._changes.push(fieldIndex)
                this.changeRequester.change(this.index)
                this.emit('change', this.get())
            },
            send: () => {
                this.changeRequester.send()
            },
            delete: () => {
                console.error('SyncObjectField: delete is not supported, as it cannot be null for its parent object. This is an undefined behaviour.')
            }
        }

        SyncObject.__init(this._object, {
            changeRequester,
            model: this.model
        })
    }

    protected toString(writer: StringWriter): void {
        SyncObject.writeString(this._object, writer)
    }

}