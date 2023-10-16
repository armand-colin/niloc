import { StringWriter } from "../../tools/StringWriter";
import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { ChangeRequester } from "../Synchronize";
import { Template } from "../Template";
import { Writer } from "../Writer";
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
        this.emitter().emit('changed')
    }

    write(writer: Writer): void {
        this._object.write(writer)
    }

    readChange(reader: Reader): void {
        const count = reader.readInt() as number
        for (let i = 0; i < count; i++) {
            const fieldIndex = reader.readInt()
            this._object.fields()[fieldIndex].readChange(reader)
        }
        this.emitter().emit('changed')
    }

    writeChange(writer: Writer): void {
        const count = this._changes.length
        writer.writeInt(count)
        for (const fieldIndex of this._changes) {
            writer.writeInt(fieldIndex)
            this._object.fields()[fieldIndex].writeChange(writer)
        }
    }

    clearChange(): void {
        for (const fieldIndex of this._changes)
            this._object.fields()[fieldIndex].clearChange()
        this._changes = []
    }

    protected onModelHandle(handle: ModelHandle): void {
        SyncObject.__setModelHandle(this._object, handle)
    }

    protected onChangeRequester(requester: ChangeRequester): void {
        SyncObject.__setChangeRequester(this._object, {
            change: (fieldIndex) => {
                this._changes.push(fieldIndex)
                requester.change(this.index())
                this.emitter().emit('changed')
            },
            send: () => {
                requester.send()
            },
            delete: () => {
                console.error('SyncObjectField: delete is not supported, as it cannot be null for its parent object. This is an undefined behaviour.')
            }
        })
    }

    protected toString(writer: StringWriter): void {
        SyncObject.write(this._object, writer)
    }

}