import { SyncObject } from "../SyncObject";
import { Template } from "../Template";
import { AnyField } from "./AnyField";
import { ArrayField } from "./ArrayField";
import { SyncObjectField } from "./SyncObjectField";
import { SyncObjectRefField } from "./SyncObjectRefField";
import { SyncObjectRefSetField } from "./SyncObjectRefSetField";
export declare namespace field {
    function any<T>(initValue: T): AnyField<T>;
    function array<T>(initValue: T[]): ArrayField<T>;
    function ref<T extends SyncObject>(objectId: string | null): SyncObjectRefField<T>;
    function object<T extends SyncObject>(template: Template<T>): SyncObjectField<T>;
    function refSet<T extends SyncObject>(): SyncObjectRefSetField<T>;
}
