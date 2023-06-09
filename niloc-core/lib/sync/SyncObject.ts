import { StringWriter } from "../tools/StringWriter";
import { ModelHandle } from "./ModelHandle";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";

export class SyncObject {

    static setChangeRequester(object: SyncObject, requester: ChangeRequester) {
        for (const field of object.fields())
            Field.setChangeRequester(field, requester)
    }

    static setModelHandle(object: SyncObject, handle: ModelHandle) {
        for (const field of object.fields())
            Field.setModelHandle(field, handle)
    }

    static toString(object: SyncObject): string {
        const writer = new StringWriter()
        this.write(object, writer)
        return writer.toString()
    }

    static write(object: SyncObject, writer: StringWriter) {
        writer.writeLine(`${object.type()}: ${object.id()} {`)
        writer.startIndent()

        for (const field of object.fields())
            Field.write(field, writer)

        writer.endIndent()
        writer.writeLine('}')
    }

    private _id: string
    private _type: string
    private _fields: Field[] | null = null

    constructor(id: string, type: string) {
        this._id = id
        this._type = type
    }

    id(): string { return this._id }
    type(): string { return this._type }

    fields(): Field[] {
        if (!this._fields)
            this._fields = this._initFields()

        return this._fields
    }

    read(reader: Reader) {
        for (const field of this.fields())
            field.read(reader)
    }

    write(writer: Writer) {
        for (const field of this.fields())
            field.write(writer)
    }

    private _initFields(): Field[] {
        const fields = []
        for (const key in this) {
            const field = this[key]
            if (field instanceof Field) {
                Field.setIndex(field, fields.length)
                fields.push(field)
            }
        }

        return fields
    }
}