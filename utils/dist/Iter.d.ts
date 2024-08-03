type Zipped<T extends any[]> = T extends [] ? [] : T extends [Iterable<infer A>, ...(infer Rest)] ? [A, ...Zipped<Rest>] : never;
type Predicate<T, U extends T> = (value: T) => value is U;
export declare class Iter<T> implements Iterable<T> {
    private readonly _iterable;
    static from<T>(iterable: Iterable<T>): Iter<T>;
    static range(size: number): Iter<number>;
    static zip<T extends Iterable<any>[]>(...iters: T): Iter<Zipped<T>>;
    static enumerate<T>(iterable: Iterable<T>): Iter<[number, T]>;
    constructor(iterable: Iterable<T>);
    filter(predicate: (value: T) => boolean): Iter<T>;
    filter<U extends T>(predicate: Predicate<T, U>): Iter<U>;
    map<U>(mapping: (value: T) => U): Iter<U>;
    enumerate(): Iter<[number, T]>;
    collect(): T[];
    [Symbol.iterator](): Iterator<T, any, undefined>;
}
export {};
