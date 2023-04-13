import { ChangeRequester, Reader, Writer } from "./Synchronize";
import { Field } from "./field/Field";
export declare class SyncObject {
    static setChangeRequester(object: SyncObject, requester: ChangeRequester): void;
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
