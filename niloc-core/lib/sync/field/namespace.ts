import { SyncObject } from "../SyncObject"
import { Template } from "../Template"
import { AnyField } from "./AnyField"
import { ArrayField } from "./ArrayField"
import { SyncObjectField } from "./SyncObjectField"
import { SyncObjectRefField } from "./SyncObjectRefField"
import { SyncObjectRefSetField } from "./SyncObjectRefSetField"

export namespace field {

    export function any<T>(initValue: T): AnyField<T> {
        return new AnyField(initValue)
    }

    export function array<T>(initValue: T[]): ArrayField<T> {
        return new ArrayField(initValue)
    }

    export function ref<T extends SyncObject>(objectId: string | null): SyncObjectRefField<T> {
        return new SyncObjectRefField(objectId)
    }

    export function object<T extends SyncObject>(template: Template<T>): SyncObjectField<T> {
        return new SyncObjectField(template)
    }

    export function refSet<T extends SyncObject>(): SyncObjectRefSetField<T> {
        return new SyncObjectRefSetField()
    }

}