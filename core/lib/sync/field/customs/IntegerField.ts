import { Reader } from "../../../serialize/Reader";
import { Writer } from "../../../serialize/Writer";
import { ValueField } from "../ValueField";

export class IntegerField extends ValueField<number> {

    protected readValue(reader: Reader): void {
        this.value = reader.readU32()
    }

    protected writeValue(writer: Writer): void {
        writer.writeU32(this.value)
    }

}