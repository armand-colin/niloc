export declare class Iter<T> {
    private _iterable;
    constructor(iterable: Iterable<T>);
    filter(predicate: (value: T) => boolean): Iter<T>;
    map<U>(mapping: (value: T) => U): Iter<U>;
    collect(): T[];
    slice(start?: number, end?: number): Iter<T>;
    [Symbol.iterator](): Iterator<T, any, undefined>;
}
