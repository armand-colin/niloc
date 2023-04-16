import { StringWriter } from "../../tools/StringWriter";
import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { ChangeRequester } from "../Synchronize";
import { Template } from "../Template";
import { Writer } from "../Writer";
import { Field } from "./Field";
export declare class SyncObjectField<T extends SyncObject> extends Field {
    private _object;
    private _changes;
    constructor(template: Template<T>, id?: string);
    get(): T;
    read(reader: Reader): void;
    write(writer: Writer): void;
    readChange(reader: Reader): void;
    writeChange(writer: Writer): void;
    protected onModelHandle(handle: ModelHandle): void;
    protected onChangeRequester(requester: ChangeRequester): void;
    protected toString(writer: StringWriter): void;
}
