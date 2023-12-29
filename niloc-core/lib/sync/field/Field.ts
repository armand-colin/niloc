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

    static isDirty(field: Field) {
        return field.dirty
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

    static writeDelta(field: Field, writer: Writer) {
        field.writeDelta(writer)
    }

    static readDelta(field: Field, reader: Reader) {
        field.readDelta(reader)
    }

    static resetDelta(field: Field) {
        field.resetDelta()
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

    private _emitter = new Emitter<FieldEvents>()
    private _index: number = -1

    protected changeRequester!: ChangeRequester
    protected model!: Model
    protected dirty: boolean = false

    index() { return this._index }
    emitter(): IEmitter<FieldEvents> { return this._emitter }

    protected abstract read(reader: Reader): void
    protected abstract write(writer: Writer): void

    protected readDelta(reader: Reader): void { this.read(reader) }
    protected writeDelta(writer: Writer): void { this.write(writer) }
    protected resetDelta(): void { }

    protected changed(): void {
        this.dirty = true
        this.changeRequester?.change(this._index)
        this._emitter.emit('changed')
    }

    // Method called once field is initialized
    protected onInit() { }

    protected toString(writer: StringWriter) { writer.writeLine("???") }

}