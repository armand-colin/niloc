import { SyncObjectRefField } from "../../sync/field/SyncObjectRefField"
import { SyncObject } from "../../sync/SyncObject"
import { KeyOfType } from "../KeyOfType"
import { custom } from "./custom"

export function syncObjectRef<
    Type extends SyncObject,
    Source extends SyncObject,
    Key extends KeyOfType<Type | null, Source>
>(objectId: string | null) {

    return custom<Type | null, Source, Key>(() => new SyncObjectRefField(objectId))

}