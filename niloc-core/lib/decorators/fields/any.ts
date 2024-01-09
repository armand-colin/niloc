import { SyncObject } from "../../main";
import { AnyField } from "../../sync/field/AnyField";
import { KeyOfType, custom } from "./custom";

export function any<T, O extends SyncObject, K extends KeyOfType<T, O> & string>(defaultValue: T) {
    
    return custom<T, O, K>(() => new AnyField(defaultValue))

}