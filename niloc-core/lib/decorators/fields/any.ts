import { SyncObject } from "../../main";
import { AnyField } from "../../sync/field/AnyField";
import { KeyOfType, custom } from "./custom";

export function any<
    T,
    Source extends SyncObject,
    Key extends KeyOfType<T, Source>
>(defaultValue: T) {

    return custom<T, Source, Key>(() => new AnyField(defaultValue))

}