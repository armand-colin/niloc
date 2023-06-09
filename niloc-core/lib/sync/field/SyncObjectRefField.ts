import { StringWriter } from "../../tools/StringWriter";
import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { Writer } from "../Writer";
import { Field } from "./Field";

export class SyncObjectRefField<T extends SyncObject> extends Field {

    private _objectId: string | null
    private _object: T | null = null
    private _modelHandle: ModelHandle | null = null
    private _objectRequest: ModelHandle.ObjectRequest | null = null

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
        this._objectRequest?.destroy()

        this._objectId = objectId
        this._object = null

        if (objectId) {
            this._objectRequest = this._modelHandle?.requestObject<T>(objectId, (object) => {
                this._object = object
            }) ?? null
        } else {
            this._objectRequest = null
        }

        this.emitter().emit('changed')
    }

    protected onModelHandle(handle: ModelHandle): void {
        this._modelHandle = handle

        if (this._objectId)
            this._setObjectId(this._objectId)
    }

    protected toString(writer: StringWriter): void {
        writer.write("ref ")
        if (this._object)
            SyncObject.write(this._object, writer)
        else
            writer.writeLine(`${this._objectId} (null)`)
    }

}