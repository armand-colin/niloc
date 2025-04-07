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

}