import { StringWriter } from "../../tools/StringWriter";
import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { Field } from "./Field";

export abstract class ValueField<T> extends Field {

    protected value: T

    constructor(initValue: T) {
        super()
        this.value = initValue
    }

    public get() { return this.value }
    
    public set(value: T) {
        this.value = value
        this.dirty = true
        this.changed()
    }

    read(reader: Reader): void {
        this.readValue(reader)
        this.emitter().emit('changed')
    }

    write(writer: Writer): void {
        writer.writeJSON(this.value)
    }

    protected abstract writeValue(writer: Writer): void;
    protected abstract readValue(reader: Reader): void;

    protected toString(writer: StringWriter): void {
        const type = typeof this.value
        switch (type) {
            case "function":
                writer.writeLine("[Function]")
                break
            case "object":
                writer.write(JSON.stringify(this.value))
                break
            default:
                writer.writeLine("" + this.value)
                break
        }
    }

}