import { StringWriter } from "../../tools/StringWriter";
import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { Field } from "./Field";
export declare class AnyField<T> extends Field {
    private _value;
    constructor(initValue: T);
    get(): T;
    set(value: T): void;
    read(reader: Reader): void;
    write(writer: Writer): void;
    protected toString(writer: StringWriter): void;
}
