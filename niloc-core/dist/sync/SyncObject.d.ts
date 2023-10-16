import { StringWriter } from "../tools/StringWriter";
import { Authority } from "./Authority";
import { ModelHandle } from "./ModelHandle";
import { Reader } from "./Reader";
import { ChangeRequester } from "./Synchronize";
import { Writer } from "./Writer";
import { Field } from "./field/Field";
import { BooleanField } from "./field/customs/BooleanField";
export declare class SyncObject {
    static __setChangeRequester(object: SyncObject, requester: ChangeRequester): void;
    static __setModelHandle(object: SyncObject, handle: ModelHandle): void;
    static toString(object: SyncObject): string;
    static write(object: SyncObject, writer: StringWriter): void;
    private _id;
    private _fields;
    private _changeRequester;
    authority: Authority;
    readonly deleted: BooleanField;
    constructor(id: string);
    id(): string;
    fields(): Field[];
    read(reader: Reader): void;
    write(writer: Writer): void;
    send(): void;
    register(callback: () => void): () => void;
    delete(): void;
    private _onDeletedChanged;
    private _initFields;
}
