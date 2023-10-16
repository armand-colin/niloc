import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { ValueField } from "./ValueField";
export declare class AnyField<T> extends ValueField<T> {
    protected readValue(reader: Reader): void;
    protected writeValue(writer: Writer): void;
}
