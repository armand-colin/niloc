import { Emitter } from "@niloc/utils";
import { StringWriter } from "../../tools/StringWriter";
import { ModelHandle } from "../ModelHandle";
import { Reader } from "../Reader";
import { ChangeRequester } from "../Synchronize";
import { Writer } from "../Writer";
interface FieldEvents {
    changed: void;
}
export declare abstract class Field {
    static setIndex(field: Field, index: number): void;
    static setChangeRequester(field: Field, requester: ChangeRequester): void;
    static setModelHandle(field: Field, handle: ModelHandle): void;
    static toString(field: Field): string;
    static write(field: Field, writer: StringWriter): void;
    private _index;
    private _changeRequester;
    private _emitter;
    index(): number;
    emitter(): Emitter<FieldEvents>;
    abstract read(reader: Reader): void;
    abstract write(writer: Writer): void;
    readChange(reader: Reader): void;
    writeChange(writer: Writer): void;
    protected changed(): void;
    protected onChangeRequester(_requester: ChangeRequester): void;
    protected onModelHandle(_handle: ModelHandle): void;
    protected toString(writer: StringWriter): void;
}
export {};
