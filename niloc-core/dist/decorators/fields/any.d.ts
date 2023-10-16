import { SyncObject } from "../../sync/SyncObject";
type KeyOfSelf<T> = T[keyof T];
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never;
}>;
export declare function any<T, O extends SyncObject, K extends KeyOfType<T, O> & string>(defaultValue: T): (target: O, propertyKey: K) => void;
export {};
