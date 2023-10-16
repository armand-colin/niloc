import { SyncObject } from "../../sync/SyncObject";
type KeyOfSelf<T> = T[keyof T];
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never;
}>;
export declare function syncObjectRef<Type extends SyncObject, Source extends SyncObject, Key extends KeyOfType<Type | null, Source> & string>(objectId: string | null): (target: Source, propertyKey: Key) => void;
export {};
