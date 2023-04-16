import { StringWriter } from "../../tools/StringWriter";
import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { Writer } from "../Writer";
import { Field } from "./Field";
export declare class SyncObjectRefField<T extends SyncObject> extends Field {
    private _objectId;
    private _object;
    private _modelHandle;
    private _objectRequest;
    constructor(objectId: string | null);
    read(reader: Reader): void;
    write(writer: Writer): void;
    set(object: T | null): void;
    get(): T | null;
    private _setObjectId;
    protected onModelHandle(handle: ModelHandle): void;
    protected toString(writer: StringWriter): void;
}
