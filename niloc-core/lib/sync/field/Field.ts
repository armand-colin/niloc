import type { Emitter } from "@niloc/utils"
import { Emitter as EmitterImpl } from "@niloc/utils"
import { StringWriter } from "../../tools/StringWriter"
import { ModelHandle } from "../ModelHandle"
import { Reader } from "../Reader"
import { ChangeRequester } from "../Synchronize"
import { Writer } from "../Writer"

interface FieldEvents {
    changed: void
}

export abstract class Field {

    public static setIndex(field: Field, index: number) {
        field._index = index
    }

    public static setChangeRequester(field: Field, requester: ChangeRequester) {
        field._changeRequester = requester
        field.onChangeRequester(requester)
    }

    public static setModelHandle(field: Field, handle: ModelHandle) {
        field.onModelHandle(handle)
    }

    public static toString(field: Field) {
        const writer = new StringWriter()
        this.write(field, writer)
        return writer.toString()
    }

    public static write(field: Field, writer: StringWriter) {
        field.toString(writer)
    }

    private _index: number = -1
    private _changeRequester: ChangeRequester | null = null
    private _emitter = new EmitterImpl<FieldEvents>() 
    
    index() { return this._index }
    emitter(): Emitter<FieldEvents> { return this._emitter }

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