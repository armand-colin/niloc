import { Reader } from "../../Reader";
import { Writer } from "../../Writer";
import { ValueField } from "../ValueField";

export class NumberField extends ValueField<number> {

    protected readValue(reader: Reader): void {
        this.value = reader.readFloat()
    }

    protected writeValue(writer: Writer): void {
        writer.writeFloat(this.value)
    }

}