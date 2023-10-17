import { Emitter, IEmitter } from "@niloc/utils"
import { StringWriter } from "../../tools/StringWriter"
import { ModelHandle } from "../ModelHandle"
import { Reader } from "../Reader"
import { ChangeRequester } from "../Synchronize"
import { Writer } from "../Writer"

interface FieldEvents {
    changed: void
}

export abstract class Field {

    static setIndex(field: Field, index: number) {
        field._index = index
    }

    static setChangeRequester(field: Field, requester: ChangeRequester) {
        field._changeRequester = requester
        field.onChangeRequester(requester)
    }

    static setModelHandle(field: Field, handle: ModelHandle) {
        field.onModelHandle(handle)
    }

    static toString(field: Field) {
        const writer = new StringWriter()
        this.write(field, writer)
        return writer.toString()
    }

    static write(field: Field, writer: StringWriter) {
        field.toString(writer)
    }

    static register(fields: Iterable<Field>, callback: () => void): () => void {
        const _fields = [...fields]

        for (const field of _fields)
            field.emitter().on('changed', callback)

        return () => {
            for (const field of _fields)
                field.emitter().off('changed', callback)
        }
    }

    private _index: number = -1
    private _changeRequester: ChangeRequester | null = null
    private _emitter = new Emitter<FieldEvents>()

    index() { return this._index }
    emitter(): IEmitter<FieldEvents> { return this._emitter }

    abstract read(reader: Reader): void
    abstract write(writer: Writer): void

    readChange(reader: Reader): void { this.read(reader) }
    writeChange(writer: Writer): void { this.write(writer) }
    clearChange(): void { }

    protected changed(): void {
        this._changeRequester?.change(this._index)
        this._emitter.emit('changed')
    }

    protected onChangeRequester(_requester: ChangeRequester) { }
    protected onModelHandle(_handle: ModelHandle) { }

    protected toString(writer: StringWriter) { writer.writeLine("???") }

}