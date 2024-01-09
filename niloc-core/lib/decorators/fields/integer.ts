import { SyncObject } from "../../main";
import { IntegerField } from "../../sync/field/customs/IntegerField";
import { KeyOfType, custom } from "./custom";

export function integer<
    Source extends SyncObject,
    Key extends KeyOfType<number, Source>
>(defaultValue: number = 0) {

    return custom<number, Source, Key>(() => new IntegerField(defaultValue))

}