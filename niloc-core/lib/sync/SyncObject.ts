import { AnyField } from "../main";
import { StringWriter } from "../tools/StringWriter";
import { ModelHandle } from "./ModelHandle";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";

export class SyncObject {

    static __setChangeRequester(object: SyncObject, requester: ChangeRequester) {
        object._changeRequester = requester
        for (const field of object.fields())
            Field.setChangeRequester(field, requester)
    }

    static __setModelHandle(object: SyncObject, handle: ModelHandle) {
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
    private _changeRequester!: ChangeRequester
    
    private _deleted = new AnyField(false)

    constructor(id: string, type: string) {
        this._id = id
        this._type = type

        this._deleted.emitter().on('changed', this._onDeletedChanged.bind(this))
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

    send() {
        this._changeRequester.send()
    }

    register(callback: () => void): () => void {
        return Field.register(this.fields(), callback)
    }

    deleted() {
        return this._deleted.get()
    }

    delete() {
        if (this.deleted())
            return
        
        this._deleted.set(true)
        this._changeRequester.send()
        this._changeRequester.delete()
    }

    private _onDeletedChanged = () => {
        const deleted = this._deleted.get()
        
        if (deleted) {
            this._changeRequester.delete()
            this._deleted.emitter().on('changed', this._onDeletedChanged.bind(this))
        }
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