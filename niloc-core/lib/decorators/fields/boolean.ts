import type { SyncObject } from "../../main";
import { BooleanField } from "../../sync/field/customs/BooleanField";
import { KeyOfType, custom } from "./custom";

export function boolean<
    Source extends SyncObject,
    Key extends KeyOfType<boolean, Source>
>(defaultValue: boolean = false) {

    return custom<boolean, Source, Key>(() => new BooleanField(defaultValue))

}