import { Emitter, IEmitter } from "@niloc/utils"
import { StringWriter } from "../../tools/StringWriter"
import { Reader } from "../Reader"
import { ChangeRequester } from "../Synchronize"
import { Writer } from "../Writer"
import { Model } from "../Model.interface"

interface FieldEvents {
    changed: void
}

export abstract class Field {

    static setIndex(field: Field, index: number) {
        field._index = index
    }

    static __init(field: Field, data: {
        changeRequester: ChangeRequester,
        model: Model
    }) {
        field.changeRequester = data.changeRequester
        field.model = data.model
        field.onInit()
    }

    static toString(field: Field) {
        const writer = new StringWriter()
        this.writeString(field, writer)
        return writer.toString()
    }

    static writeString(field: Field, writer: StringWriter) {
        field.toString(writer)
    }

    static write(field: Field, writer: Writer) {
        field.write(writer)
    }

    static read(field: Field, reader: Reader) {
        field.read(reader)
    }

    static writeChange(field: Field, writer: Writer) {
        field.writeChange(writer)
    }

    static readChange(field: Field, reader: Reader) {
        field.readChange(reader)
    }

    static clearChange(field: Field) {
        field.clearChange()
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

    protected changeRequester!: ChangeRequester
    protected model!: Model

    private _emitter = new Emitter<FieldEvents>()

    index() { return this._index }
    emitter(): IEmitter<FieldEvents> { return this._emitter }

    protected abstract read(reader: Reader): void
    protected abstract write(writer: Writer): void

    protected readChange(reader: Reader): void { this.read(reader) }
    protected writeChange(writer: Writer): void { this.write(writer) }
    protected clearChange(): void { }

    protected changed(): void {
        this.changeRequester?.change(this._index)
        this._emitter.emit('changed')
    }

    // Method called once field is initialized
    protected onInit() { }

    protected toString(writer: StringWriter) { writer.writeLine("???") }

}