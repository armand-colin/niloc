import { Reader, Writer } from "../Synchronize";
import { Field } from "./Field";

export class AnyField<T> extends Field {

    private _value: T

    constructor(initValue: T) {
        super()
        this._value = initValue
    }

    public get value() { return this._value }
    public set value(value: T) { 
        this._value = value
    }

    read(reader: Reader): void {
        this._value = reader.read()
    }
     
    write(writer: Writer): void {
        writer.write(this._value)
    }

}