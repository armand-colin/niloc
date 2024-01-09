import { Reader } from "../../Reader";
import { Writer } from "../../Writer";
import { ValueField } from "../ValueField";

export class IntegerField extends ValueField<number> {

    protected readValue(reader: Reader): void {
        this.value = reader.readInt()
    }

    protected writeValue(writer: Writer): void {
        writer.writeInt(this.value)
    }

}