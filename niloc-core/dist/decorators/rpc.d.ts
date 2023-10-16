import { SyncObject } from "../sync/SyncObject";
type KeyOfSelf<T> = T[keyof T];
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never;
}>;
export declare function host<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>(): (target: O, propertyKey: K, descriptor: TypedPropertyDescriptor<(...args: Args) => any>) => void;
export declare function all<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>(): (target: O, propertyKey: K, descriptor: TypedPropertyDescriptor<(...args: Args) => any>) => void;
export declare function broadcast<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>(): (target: O, propertyKey: K, descriptor: TypedPropertyDescriptor<(...args: Args) => any>) => void;
export declare function owner<Args extends any[], O extends SyncObject, K extends KeyOfType<(...args: Args) => any, O> & string>(): (target: O, propertyKey: K, descriptor: TypedPropertyDescriptor<(...args: Args) => any>) => void;
export declare function dynamic<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>(getTargetId: () => string): (target: O, propertyKey: K, descriptor: TypedPropertyDescriptor<(...args: Args) => any>) => void;
export declare const rpc: {
    host: typeof host;
    all: typeof all;
    broadcast: typeof broadcast;
    owner: typeof owner;
    dynamic: typeof dynamic;
};
export {};
