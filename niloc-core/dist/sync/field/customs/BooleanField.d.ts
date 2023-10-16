import { Reader } from "../../Reader";
import { Writer } from "../../Writer";
import { ValueField } from "../ValueField";
export declare class BooleanField extends ValueField<boolean> {
    protected readValue(reader: Reader): void;
    protected writeValue(writer: Writer): void;
}
