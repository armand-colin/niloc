import { StringWriter } from "../../tools/StringWriter";
import { Reader, Writer } from "../Synchronize";
import { Field } from "./Field";

export class AnyField<T> extends Field {

    private _value: T

    constructor(initValue: T) {
        super()
        this._value = initValue
    }

    public get() { return this._value }
    public set(value: T) {
        this._value = value
        this.changed()
    }

    read(reader: Reader): void {
        this._value = reader.read()
    }

    write(writer: Writer): void {
        writer.write(this._value)
    }

    protected toString(writer: StringWriter): void {
        const type = typeof this._value
        switch (type) {
            case "function":
                writer.writeLine("[Function]")
                break
            case "object":
                writer.write(JSON.stringify(this._value))
                break
            default:
                writer.writeLine("" + this._value)
                break
        }
    }

}