import { Reader } from "../../../serialize/Reader";
import { Writer } from "../../../serialize/Writer";
import { ValueField } from "../ValueField";

export class NumberField extends ValueField<number> {

    protected readValue(reader: Reader): void {
        this.value = reader.readF32()
    }

    protected writeValue(writer: Writer): void {
        writer.writeF32(this.value)
    }

}