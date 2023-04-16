import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { SyncObject } from "../SyncObject";
import { Writer } from "../Writer";
import { Field } from "./Field";
export declare class SyncObjectRefSetField<T extends SyncObject> extends Field {
    private _objects;
    private _modelHandle;
    add(object: T): void;
    remove(object: T): void;
    has(object: T): boolean;
    values(): IterableIterator<T>;
    read(reader: Reader): void;
    write(writer: Writer): void;
    protected onModelHandle(handle: ModelHandle): void;
}
