import { SyncObjectType } from "../../main"
import { SyncObjectField } from "../../sync/field/SyncObjectField"
import { SyncObject } from "../../sync/SyncObject"
import { custom, KeyOfType } from "./custom"

export function syncObject<
    Type extends SyncObject, 
    Source extends SyncObject, 
    Key extends KeyOfType<Type, Source>
>(type: SyncObjectType<Type>) {

    return custom<Type, Source, Key>(() => new SyncObjectField(type))

}