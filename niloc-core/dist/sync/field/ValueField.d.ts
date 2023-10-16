import { StringWriter } from "../../tools/StringWriter";
import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { Field } from "./Field";
export declare abstract class ValueField<T> extends Field {
    protected value: T;
    constructor(initValue: T);
    get(): T;
    set(value: T): void;
    read(reader: Reader): void;
    write(writer: Writer): void;
    protected abstract writeValue(writer: Writer): void;
    protected abstract readValue(reader: Reader): void;
    protected toString(writer: StringWriter): void;
}
