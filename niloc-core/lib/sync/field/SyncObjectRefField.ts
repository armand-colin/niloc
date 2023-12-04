import { StringWriter } from "../../tools/StringWriter";
import { ObjectRequest } from "../Model.interface";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { Writer } from "../Writer";
import { Field } from "./Field";

export class SyncObjectRefField<T extends SyncObject> extends Field {

    private _objectId: string | null
    private _object: T | null = null
    private _objectRequest: ObjectRequest | null = null

    constructor(objectId: string | null) {
        super()
        this._objectId = objectId
    }

    read(reader: Reader): void {
        const objectId = reader.readJSON()

        if (objectId === this._objectId)
            return

        this._setObjectId(objectId)
        this.emitter().emit('changed')
    }

    write(writer: Writer): void {
        writer.writeJSON(this._objectId)
    }

    set(object: T | null): void {
        const objectId = object?.id() ?? null
        
        if (objectId === this._objectId)
            return

        this._setObjectId(objectId)

        this.changed()
    }

    get(): T | null {
        return this._object
    }

    private _setObjectId(objectId: string | null) {
        this._objectRequest?.dispose()

        this._objectId = objectId
        this._object = null

        if (objectId) {
            this._objectRequest = this.model.requestObject<T>(objectId, (object) => {
                if (object === this._object)
                    return

                this._object = object
                this.emitter().emit('changed')
            })
        } else {
            this._objectRequest = null
        }

        this.emitter().emit('changed')
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