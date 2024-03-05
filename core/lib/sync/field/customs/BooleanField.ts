import { Reader } from "../../../serialize/Reader";
import { Writer } from "../../../serialize/Writer";
import { ValueField } from "../ValueField";

export class BooleanField extends ValueField<boolean> {

    protected readValue(reader: Reader): void {
        this.value = reader.readBoolean()
    }

    protected writeValue(writer: Writer): void {
        writer.writeBoolean(this.value)
    }

}