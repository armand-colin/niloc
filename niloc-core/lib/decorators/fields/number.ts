import { SyncObject } from "../../main";
import { NumberField } from "../../sync/field/customs/NumberField";
import { KeyOfType, custom } from "./custom";

export function number<
    Source extends SyncObject,
    Key extends KeyOfType<number, Source>
>(defaultValue: number = 0) {

    return custom<number, Source, Key>(() => new NumberField(defaultValue))

}