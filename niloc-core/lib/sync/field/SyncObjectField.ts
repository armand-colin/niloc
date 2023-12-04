import { StringWriter } from "../../tools/StringWriter";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { SyncObjectType } from "../SyncObjectType";
import { ChangeRequester } from "../Synchronize";
import { Writer } from "../Writer";
import { Field } from "./Field";

export class SyncObjectField<T extends SyncObject> extends Field {

    private _object: T
    private _changes: number[] = []

    constructor(type: SyncObjectType<T>, id?: string) {
        super()
        this._object = new type(id ?? "sub")
    }

    get(): T {
        return this._object
    }

    read(reader: Reader): void {
        SyncObject.read(this._object, reader)
        this.emitter().emit('changed')
    }

    write(writer: Writer): void {
        SyncObject.write(this._object, writer)
    }

    readChange(reader: Reader): void {
        const count = reader.readInt() as number
        for (let i = 0; i < count; i++) {
            const fieldIndex = reader.readInt()
            Field.readChange(this._object.fields()[fieldIndex], reader)
        }
        this.emitter().emit('changed')
    }

    writeChange(writer: Writer): void {
        const count = this._changes.length
        writer.writeInt(count)
        for (const fieldIndex of this._changes) {
            writer.writeInt(fieldIndex)
            Field.writeChange(this._object.fields()[fieldIndex], writer)
        }
    }

    clearChange(): void {
        for (const fieldIndex of this._changes)
            Field.clearChange(this._object.fields()[fieldIndex])
        this._changes = []
    }

    protected onInit(): void {
        super.onInit()

        const changeRequester: ChangeRequester = {
            change: (fieldIndex) => {
                this._changes.push(fieldIndex)
                this.changeRequester.change(this.index())
                this.emitter().emit('changed')
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