import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { Field } from "./Field";
export declare class ArrayField<T> extends Field {
    private _value;
    private _changes;
    constructor(initValue: T[]);
    get(): ReadonlyArray<T>;
    push(...values: T[]): void;
    pop(): T | null;
    set(array: T[]): void;
    setAt(index: number, value: T): void;
    clear(): void;
    read(reader: Reader): void;
    write(writer: Writer): void;
    readChange(reader: Reader): void;
    writeChange(writer: Writer): void;
    clearChange(): void;
}
