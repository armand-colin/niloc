export interface PoolOpts<T> {
    create(): T;
}
export declare class Pool<T> {
    private _values;
    private _opts;
    constructor(opts: PoolOpts<T>);
    get(): T;
    free(value: T): void;
}
