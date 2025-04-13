export type Result<T, E> = {
    ok: true,
    value: T
} | {
    ok: false,
    error: E
}

export namespace Result {

    export function ok<T, E = unknown>(value: T): Result<T, E> {
        return { ok: true, value: value }
    }

    export function error<E, T = unknown>(error: E): Result<T, E> {
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