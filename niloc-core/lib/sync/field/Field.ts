import { StringWriter } from "../../tools/StringWriter"
import { ModelHandle } from "../ModelHandle"
import { Reader } from "../Reader"
import { ChangeRequester } from "../Synchronize"
import { Writer } from "../Writer"

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

    index() { return this._index }

    abstract read(reader: Reader): void
    abstract write(writer: Writer): void

    readChange(reader: Reader): void { this.read(reader) }
    writeChange(writer: Writer): void { this.write(writer) }

    protected changed(): void {
        this._changeRequester?.change(this._index)
    }

    protected onChangeRequester(_requester: ChangeRequester) { }
    protected onModelHandle(_handle: ModelHandle) { }

    protected toString(writer: StringWriter) { writer.writeLine("???") }

}