import { StringWriter } from "../tools/StringWriter";
import { ModelHandle } from "./ModelHandle";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";
export declare class SyncObject {
    static setChangeRequester(object: SyncObject, requester: ChangeRequester): void;
    static setModelHandle(object: SyncObject, handle: ModelHandle): void;
    static toString(object: SyncObject): string;
    static write(object: SyncObject, writer: StringWriter): void;
    private _id;
    private _type;
    private _fields;
    constructor(id: string, type: string);
    id(): string;
    type(): string;
    fields(): Field[];
    read(reader: Reader): void;
    write(writer: Writer): void;
    private _initFields;
}
