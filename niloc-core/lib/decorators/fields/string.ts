import { SyncObject } from "../../main";
import { StringField } from "../../sync/field/customs/StringField";
import { KeyOfType, custom } from "./custom";

export function string<O extends SyncObject, K extends KeyOfType<string, O> & string>(defaultValue: string = "") {
    
    return custom<string, O, K>(() => new StringField(defaultValue))

}