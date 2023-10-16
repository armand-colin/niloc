import { SyncObject } from "../../sync/SyncObject";
import { Template } from "../../sync/Template";
type KeyOfSelf<T> = T[keyof T];
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never;
}>;
export declare function syncObject<Type extends SyncObject, Source extends SyncObject, Key extends KeyOfType<Type, Source> & string>(template: Template<Type>): (target: Source, propertyKey: Key) => void;
export {};
