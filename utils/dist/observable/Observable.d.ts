import { Transformer } from './Transformer';
export declare class Observable<T> {
    private _value;
    private _subscribers;
    private _dispatching;
    private _pendingUnsubscribers;
    private _destroyed;
    private _onDestroy?;
    constructor(value: T, onDestroy?: () => void);
    get value(): T;
    set value(value: T);
    next(): Promise<T>;
    dispatch(): void;
    subscribe(subscriber: (value: T) => void, dispatch?: boolean): typeof subscriber;
    unsubscribe(subscriber: (value: T) => void): void;
    map<U>(transform: (value: T) => U): Observable<U>;
    pipe<U>(transformer: Transformer<T, U>): Observable.Pipe<T, U>;
    destroy(): void;
}
export declare namespace Observable {
    class Pipe<T, U> {
        private readonly _observable;
        private readonly _transformer;
        constructor(_observable: Observable<T>, _transformer: Transformer<T, U>);
        pipe<V>(transformer: Transformer<U, V>): Pipe<T, V>;
        observable(): Observable<U>;
    }
}
export declare namespace Observable {
    function fromPromise<T>(promise: Promise<T>): Observable<T | undefined>;
    function interval(delayInMilliseconds: number): Observable<number>;
}
