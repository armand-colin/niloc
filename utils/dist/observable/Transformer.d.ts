export type Transformer<T, U = T> = {
    map(value: T): U;
    event(value: T, dispatch: (value: U) => void): void;
};
export declare namespace Transformer {
    function map<T, U>(mapping: (value: T) => U): Transformer<T, U>;
    const toString: Transformer<any, string>;
    function debounce<T>(delayInMilliseconds: number): Transformer<T>;
}
export declare namespace Transformer.Utils {
    function chain<T, U, V>(a: Transformer<T, U>, b: Transformer<U, V>): Transformer<T, V>;
}
