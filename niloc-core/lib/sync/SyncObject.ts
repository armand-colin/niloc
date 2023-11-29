import { StringWriter } from "../tools/StringWriter";
import { Authority } from "./Authority";
import { Model } from "./Model.interface";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";
import { BooleanField } from "./field/customs/BooleanField";

export class SyncObject {

    static __setChangeRequester(object: SyncObject, requester: ChangeRequester) {
        object._changeRequester = requester
        for (const field of object.fields())
            Field.__setChangeRequester(field, requester)
    }

    static __setModel(object: SyncObject, model: Model) {
        object.model = model
        for (const field of object.fields())
            Field.__setModel(field, model)
    }

    static toString(object: SyncObject): string {
        const writer = new StringWriter()
        this.write(object, writer)
        return writer.toString()
    }

    static write(object: SyncObject, writer: StringWriter) {
        writer.writeLine(`${object.constructor.name}: ${object.id()} {`)
        writer.startIndent()

        for (const field of object.fields())
            Field.write(field, writer)

        writer.endIndent()
        writer.writeLine('}')
    }

    readonly _id: string
    private _fields: Field[] | null = null
    private _changeRequester!: ChangeRequester
    
    authority = Authority.All
    
    readonly deleted = new BooleanField(false)
    
    protected model!: Model

    constructor(id: string) {
        this._id = id

        this.deleted.emitter().on('changed', this._onDeletedChanged.bind(this))
    }

    id(): string { return this._id }

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

    delete() {
        if (this.deleted.get())
            return

        this.deleted.set(true)
        this._changeRequester.send()
        this._changeRequester.delete()
    }

    private _onDeletedChanged = () => {
        const deleted = this.deleted.get()
        
        if (deleted) {
            this._changeRequester.delete()
            this.deleted.emitter().on('changed', this._onDeletedChanged.bind(this))
        }
    }

    private _initFields(): Field[] {
        const fields: Field[] = []
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