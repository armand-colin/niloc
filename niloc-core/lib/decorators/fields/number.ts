import { SyncObject } from "../../main";
import { NumberField } from "../../sync/field/customs/NumberField";
import { KeyOfType, custom } from "./custom";

export function number<O extends SyncObject, K extends KeyOfType<number, O> & string>(defaultValue: number = 0) {
    
    return custom<number, O, K>(() => new NumberField(defaultValue))

}