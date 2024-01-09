import { SyncObject } from "../../main";
import { BooleanField } from "../../sync/field/customs/BooleanField";
import { KeyOfType, custom } from "./custom";

export function boolean<O extends SyncObject, K extends KeyOfType<boolean, O> & string>(defaultValue: boolean = false) {

    return custom<boolean, O, K>(() => new BooleanField(defaultValue))

}