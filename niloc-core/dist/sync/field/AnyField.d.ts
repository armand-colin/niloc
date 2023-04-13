import { Reader, Writer } from "../Synchronize";
import { Field } from "./Field";
export declare class AnyField<T> extends Field {
    private _value;
    constructor(initValue: T);
    get value(): T;
    set value(value: T);
    read(reader: Reader): void;
    write(writer: Writer): void;
}
