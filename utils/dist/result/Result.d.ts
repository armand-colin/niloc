export type Result<T, E> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
export declare namespace Result {
    function ok<T, E = unknown>(value: T): Result<T, E>;
    function error<E, T = unknown>(error: E): Result<T, E>;
}
