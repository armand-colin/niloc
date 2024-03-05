import { Reader } from "../../../serialize/Reader";
import { Writer } from "../../../serialize/Writer";
import { ValueField } from "../ValueField";

export class StringField extends ValueField<string> {

    protected readValue(reader: Reader): void {
        this.value = reader.readString()
    }

    protected writeValue(writer: Writer): void {
        writer.writeString(this.value)
    }

}