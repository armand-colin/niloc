import { StringWriter } from "../../tools/StringWriter";
import { Reader } from "../../serialize/Reader";
import { Writer } from "../../serialize/Writer";
import { Field } from "./Field";

export abstract class ValueField<T> extends Field {

    protected value: T

    constructor(initValue: T) {
        super()
        this.value = initValue
    }

    get() { 
        return this.value 
    }
    
    set(value: T) {
        if (this.equals(this.value, value))
            return
        
        this.value = value
        this.changed()
    }

    read(reader: Reader): void {
        this.readValue(reader)
        this.emit('change', this.get())
    }

    write(writer: Writer): void {
        this.writeValue(writer)
    }

    protected abstract writeValue(writer: Writer): void;
    protected abstract readValue(reader: Reader): void;

    protected equals(a: T, b: T): boolean {
        return a === b
    }

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