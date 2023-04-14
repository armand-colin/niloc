import { StringWriter } from "../../tools/StringWriter"
import { ModelHandle } from "../ModelHandle"
import { ChangeRequester, Reader, Writer } from "../Synchronize"

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

    protected onChangeRequester(requester: ChangeRequester) { }
    protected onModelHandle(handle: ModelHandle) { }

    protected toString(writer: StringWriter) { writer.writeLine("???") }

}