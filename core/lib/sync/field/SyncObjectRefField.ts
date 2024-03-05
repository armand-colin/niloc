import { StringWriter } from "../../tools/StringWriter";
import { SyncObject } from "../SyncObject";
import { Reader } from "../../serialize/Reader";
import { Writer } from "../../serialize/Writer";
import { Field } from "./Field";

export class SyncObjectRefField<T extends SyncObject> extends Field<T | null> {

    private _objectId: string | null
    private _object: T | null = null
    private _objectRequest: ((object: T | null) => void) | null = null

    constructor(objectId: string | null) {
        super()
        this._objectId = objectId
    }

    read(reader: Reader): void {
        const objectId = reader.readJSON()

        if (objectId === this._objectId)
            return

        this._setObjectId(objectId)
        this.emit('change', this.get())
    }

    write(writer: Writer): void {
        writer.writeJSON(this._objectId)
    }

    set(object: T | null): void {
        const objectId = object?.id ?? null

        if (objectId === this._objectId)
            return

        this._setObjectId(objectId)

        this.changed()
    }

    get(): T | null {
        return this._object
    }

    private _setObjectId(objectId: string | null) {
        if (this._objectId && this._objectRequest) {
            this.model.unregisterObject<T>(this._objectId, this._objectRequest)
            this._objectRequest = null
        }

        this._objectId = objectId
        this._object = null

        if (objectId) {
            this._objectRequest = (object: T | null) => {
                if (object === this._object)
                    return

                this._object = object
                this.emit('change', this.get())
            }

            this.model.registerObject<T>(objectId, this._objectRequest)
        } else {
            this._objectRequest = null
        }

        this.emit('change', this.get())
    }

    protected onInit(): void {
        super.onInit()

        if (this._objectId)
            this._setObjectId(this._objectId)
    }

    protected toString(writer: StringWriter): void {
        writer.write("ref ")
        if (this._object)
            SyncObject.writeString(this._object, writer)
        else
            writer.writeLine(`${this._objectId} (null)`)
    }

}