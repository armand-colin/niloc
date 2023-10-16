import { SyncObjectType } from "../../main";
import { SyncObject } from "../../sync/SyncObject";
type KeyOfSelf<T> = T[keyof T];
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never;
}>;
export declare function syncObject<Type extends SyncObject, Source extends SyncObject, Key extends KeyOfType<Type, Source> & string>(type: SyncObjectType<Type>): (target: Source, propertyKey: Key) => void;
export {};
