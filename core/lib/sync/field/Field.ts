import { Emitter } from "@niloc/utils"
import { StringWriter } from "../../tools/StringWriter"
import { Writer } from "../../serialize/Writer"
import { Reader } from "../../serialize/Reader"
import type { Model } from "../Model"

interface FieldEvents<T> {
    change: T
}

export abstract class Field<T = any> extends Emitter<FieldEvents<T>> {

    static setIndex(field: Field, index: number) {
        field._index = index
    }

    static __init(field: Field, data: { model: Model }) {
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
        field.dirty = false
    }

    static register(fields: Iterable<Field>, callback: () => void): () => void {
        const _fields = [...fields]

        for (const field of _fields)
            field.on('change', callback)

        return () => {
            for (const field of _fields)
                field.off('change', callback)
        }
    }

    private _index: number = -1

    protected model!: Model
    protected dirty: boolean = false

    get index() { 
        return this._index 
    }

    abstract get(): T
    abstract set(value: T): void

    protected abstract read(reader: Reader): void
    protected abstract write(writer: Writer): void

    protected readDelta(reader: Reader): void { this.read(reader) }
    protected writeDelta(writer: Writer): void { this.write(writer) }
    protected resetDelta(): void { }

    protected changed(): void {
        this.dirty = true
        this.emit('change', this.get())
    }

    // Method called once field is initialized
    protected onInit() { }

    protected toString(writer: StringWriter) { writer.writeLine("???") }

}