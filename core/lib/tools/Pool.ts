export interface PoolOpts<T> {
    create(): T
}

export class Pool<T> {

    private _values: T[] = []
    private _opts: PoolOpts<T>

    constructor(opts: PoolOpts<T>) {
        this._opts = opts
    }

    get(): T {
        if (this._values.length)
            return this._values.pop()!
        return this._opts.create()
    }

    free(value: T) {
        this._values.push(value)
    }

}