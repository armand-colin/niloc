import { StringWriter } from "../tools/StringWriter";
import { ModelHandle } from "./ModelHandle";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";
export declare class SyncObject {
    static __setChangeRequester(object: SyncObject, requester: ChangeRequester): void;
    static __setModelHandle(object: SyncObject, handle: ModelHandle): void;
    static toString(object: SyncObject): string;
    static write(object: SyncObject, writer: StringWriter): void;
    private _id;
    private _type;
    private _fields;
    private _changeRequester;
    constructor(id: string, type: string);
    id(): string;
    type(): string;
    fields(): Field[];
    read(reader: Reader): void;
    write(writer: Writer): void;
    send(): void;
    register(callback: () => void): () => void;
    private _initFields;
}
