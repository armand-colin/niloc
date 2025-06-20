export type Result<T = unknown, E = unknown> = Result.Ok<T> | Result.Error<E>

export namespace Result {

    export type Ok<T> = { ok: true, value: T }
    export type Error<E> = { ok: false, error: E }

    export function ok<T>(value: T): Ok<T> {
        return { ok: true, value: value }
    }

    export function error<E>(error: E): Error<E> {
        return { ok: false, error: error }
    }

    export function map<T, E, U>(result: Result<T, E>, mapper: (value: T) => U): Result<U, E> {
        if (result.ok)
            return Result.ok(mapper(result.value))

        return result
    }

    export function unwrap<T>(result: Result<T, unknown>): T {
        if (result.ok)
            return result.value

        throw new Error("Error unwrapping error variant: " + result.error)
    }

}