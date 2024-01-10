import { SyncObject } from "../../main";
import { StringField } from "../../sync/field/customs/StringField";
import { KeyOfType } from "../KeyOfType";
import { custom } from "./custom";

export function string<
    Source extends SyncObject,
    Key extends KeyOfType<string, Source>
>(defaultValue: string = "") {

    return custom<string, Source, Key>(() => new StringField(defaultValue))

}