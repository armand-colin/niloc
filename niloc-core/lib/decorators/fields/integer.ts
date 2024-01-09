import { SyncObject } from "../../main";
import { IntegerField } from "../../sync/field/customs/IntegerField";
import { KeyOfType, custom } from "./custom";

export function integer<O extends SyncObject, K extends KeyOfType<number, O> & string>(defaultValue: number = 0) {
    
    return custom<number, O, K>(() => new IntegerField(defaultValue))

}