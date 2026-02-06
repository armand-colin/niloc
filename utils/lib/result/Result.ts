export type Result<T = unknown, E = unknown> = Ok<T, E> | Error<E, T>

abstract class BaseResult<T, E> {

    abstract ok: boolean

    protected data: T | E

    constructor(data: T | E) {
        this.data = data
    }

    unwrap(): T {
        if (this.ok)
            return this.data as T

        throw new Error("Error unwrapping error variant: " + this.data)
    }

    map<U, F>(mapper: (result: Result<T, E>) => Result<U, F>): Result<U, F> {
        return mapper(this as unknown as Result<T, E>)
    }

    mapOk<U>(mapper: (value: T) => U): Result<U, E> {
        if (this.ok)
            return Result.ok(mapper(this.data as T))

        return Result.error(this.data as E)
    }

    mapError<F>(mapper: (error: E) => F): Result<T, F> {
        if (this.ok)
            return Result.ok(this.data as T)

        return Result.error(mapper(this.data as E))
    }

    async(): AsyncResult<T, E> {
        return new AsyncResult<T, E>(Promise.resolve(this as unknown as Result<T, E>))
    }

}

class Ok<T, E = unknown> extends BaseResult<T, E> {

    readonly ok = true

    constructor(value: T) {
        super(value)
    }

    get value(): T {
        return this.data as T
    }

}
class Error<E, T = unknown> extends BaseResult<T, E> {

    readonly ok = false

    constructor(error: E) {
        super(error)
    }

    get error(): E {
        return this.data as E
    }

}

export namespace Result {

    export function ok<T, E = unknown>(value: T): Result<T, E> {
        return new Ok<T, E>(value)
    }

    export function error<E, T = unknown>(error: E): Result<T, E> {
        return new Error<E, T>(error)
    }

    export function promise<T, E>(promise: Promise<T>): Promise<Result<T, E>> {
        return promise
            .then(value => Result.ok<T, E>(value))
            .catch(error => Result.error<E, T>(error))
    }

}

export class AsyncResult<T = unknown, E = unknown> {

    protected promise: Promise<Result<T, E>>

    constructor(promise: Promise<Result<T, E>>) {
        this.promise = promise
    }

    async await(): Promise<Result<T, E>> {
        return this.promise
    }

}