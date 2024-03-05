import { Emitter } from "@niloc/utils";
import { StringWriter } from "../tools/StringWriter";
import { Authority } from "./Authority";
import { Model } from "./Model.interface";
import { ChangeRequester } from "./ChangeRequester";
import { Field } from "./field/Field";
import { boolean } from "../decorators/fields/boolean";
import { Reader } from "../serialize/Reader";
import { Writer } from "../serialize/Writer";

type SyncObjectEvents = {
    delete: void
}

export class SyncObject extends Emitter<SyncObjectEvents> {

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
        this.writeString(object, writer)
        return writer.toString()
    }

    static writeString(object: SyncObject, writer: StringWriter) {
        writer.writeLine(`${object.constructor.name}: ${object.id} {`)
        writer.startIndent()

        for (const field of object.fields())
            Field.writeString(field, writer)

        writer.endIndent()
        writer.writeLine('}')
    }

    static write(object: SyncObject, writer: Writer) {
        object.write(writer)
    }

    static read(object: SyncObject, reader: Reader) {
        object.read(reader)
    }

    static isDirty(object: SyncObject): boolean {
        for (const field of object.fields())
            if (Field.isDirty(field))
                return true

        return false
    }

    static getDirtyFields(object: SyncObject): Field[] {
        const fields: Field[] = []
        for (const field of object.fields())
            if (Field.isDirty(field))
                fields.push(field)

        return fields
    }


    authority = Authority.All

    readonly id: string

    @boolean(false)
    deleted!: boolean

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
        super()

        this.id = id
        this.register("deleted", this._onDeletedChange)
    }

    fields(): Field[] {
        if (!this._fields)
            this._fields = this._initFields()

        return this._fields
    }

    protected read(reader: Reader) {
        for (const field of this.fields())
            Field.read(field, reader)
    }

    protected write(writer: Writer) {
        for (const field of this.fields())
            Field.write(field, writer)
    }

    send() {
        this.changeRequester.send()
    }

    private _registerMap = new Map<() => void, () => void>()

    registerAll(callback: () => void): void {
        if (this._registerMap.has(callback))
            return

        const unregister = Field.register(this.fields(), callback)
        this._registerMap.set(callback, unregister)
    }

    unregisterAll(callback: () => void): void {
        if (!this._registerMap.has(callback))
            return

        const unregister = this._registerMap.get(callback)!
        unregister()
        this._registerMap.delete(callback)
    }

    register<K extends keyof this & string>(fieldName: K, callback: (value: this[K]) => void): void {
        const field = this[fieldName]
        if (field && field instanceof Field) {
            field.on('change', callback)
            return
        }

        // Check if decorator exists
        const decoratedFieldName = `$${fieldName}`
        const decoratedField = this[decoratedFieldName as keyof this]
        if (decoratedField && decoratedField instanceof Field) {
            decoratedField.on('change', callback)
            return
        }

        throw new Error(`Field ${fieldName} does not exist on type ${this.constructor.name}`)
    }

    unregister<K extends keyof this & string>(fieldName: K, callback: (value: this[K]) => void): void {
        const field = this[fieldName]
        if (field && field instanceof Field) {
            field.off('change', callback)
            return
        }

        // Check if decorator exists
        const decoratedFieldName = `$${fieldName}`
        const decoratedField = this[decoratedFieldName as keyof this]
        if (decoratedField && decoratedField instanceof Field) {
            decoratedField.off('change', callback)
            return
        }

        throw new Error(`Field ${fieldName} does not exist on type ${this.constructor.name}`)
    }

    delete() {
        if (this.deleted)
            return

        this.deleted = true
    }

    private _onDeletedChange = () => {
        if (this.deleted) {
            this.emit('delete')
            this.onDelete()
            this.changeRequester.delete()

            // Point of no return
            this.removeAllListeners()
        }
    }

    // Method called when the object is created and everything is setup
    protected onInit() { }
    protected onDelete() { }

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