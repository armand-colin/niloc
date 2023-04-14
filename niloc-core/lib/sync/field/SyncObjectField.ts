import { StringWriter } from "../../tools/StringWriter";
import { ModelHandle } from "../ModelHandle";
import { SyncObject } from "../SyncObject";
import { ChangeRequester, Reader, Writer } from "../Synchronize";
import { Template } from "../Template";
import { Field } from "./Field";

export class SyncObjectField<T extends SyncObject> extends Field {

    private _object: T
    private _changes: number[] = []

    constructor(template: Template<T>, id?: string) {
        super()
        this._object = template.create(id ?? "sub")
    }

    get(): T {
        return this._object
    }

    read(reader: Reader): void {
        this._object.read(reader)
    }

    write(writer: Writer): void {
        this._object.write(writer)
    }

    readChange(reader: Reader): void {
        const count = reader.read() as number
        for (let i = 0; i < count; i++) {
            const fieldIndex = reader.read()
            this._object.fields()[fieldIndex].readChange(reader)
        }
    }

    writeChange(writer: Writer): void {
        const count = this._changes.length
        writer.write(count)
        for (const fieldIndex of this._changes) {
            writer.write(fieldIndex)
            this._object.fields()[fieldIndex].writeChange(writer)
        }
        this._changes = []
    }

    protected onModelHandle(handle: ModelHandle): void {
        SyncObject.setModelHandle(this._object, handle)
    }

    protected onChangeRequester(requester: ChangeRequester): void {
        SyncObject.setChangeRequester(this._object, {
            change: (fieldIndex) => {
                this._changes.push(fieldIndex)
                requester.change(this.index())
            },
        })
    }

    protected toString(writer: StringWriter): void {
        SyncObject.write(this._object, writer)
    }

}