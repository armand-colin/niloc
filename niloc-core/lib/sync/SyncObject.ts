import { StringWriter } from "../tools/StringWriter";
import { Authority } from "./Authority";
import { Model } from "./Model.interface";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";
import { BooleanField } from "./field/customs/BooleanField";

export class SyncObject {

    static __init(object: SyncObject, data: { 
        changeRequester: ChangeRequester,
        model: Model
    }) {
        // First set the change requester
        object.changeRequester = data.changeRequester
        object.model = data.model

        for (const field of object.fields())
            Field.__init(field, data)

        // Finally call the onInit method
        object.onInit()
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
    readonly deleted = new BooleanField(false)
    
    authority = Authority.All
    
    /**
     * Only available after the object is initialized (onInit has been called)
     */
    protected model!: Model
    /**
     * Only available after the object is initialized (onInit has been called)
     */
    protected changeRequester!: ChangeRequester
    
    private _fields: Field[] | null = null

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
        this.changeRequester.send()
    }

    register(callback: () => void): () => void {
        return Field.register(this.fields(), callback)
    }

    delete() {
        if (this.deleted.get())
            return

        this.deleted.set(true)
        this.changeRequester.send()
        this.changeRequester.delete()
    }

    // Method called when the object is created and everything is setup
    protected onInit() { }

    private _onDeletedChanged = () => {
        const deleted = this.deleted.get()
        
        if (deleted) {
            this.changeRequester.delete()
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