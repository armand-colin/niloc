import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { ValueField } from "./ValueField";

export class AnyField<T> extends ValueField<T> {

    protected readValue(reader: Reader): void {
        this.value = reader.readJSON()
    }

    protected writeValue(writer: Writer): void {
        writer.writeJSON(this.value)
    }

}