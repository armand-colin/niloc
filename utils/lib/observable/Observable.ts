import { Transformer } from './Transformer'

export class Observable<T> {

    private _value: T
    private _subscribers: ((value: T) => void)[] = []

    private _dispatching = false
    private _pendingSubscribers: ((value: T) => void)[] = []

    private _destroyed = false
    private _onDestroy?: () => void

    constructor(value: T, onDestroy?: () => void) {
        this._value = value
        this._onDestroy = onDestroy
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
        if (this._destroyed) {
            console.warn('Observable has been destroyed')
            return
        }

        if (value === this._value)
            return

        this._value = value
        this.dispatch()
    }

    dispatch() {
        this._dispatching = true

        for (const subscriber of this._subscribers)
            subscriber(this._value)

        this._dispatching = false

        while (this._pendingSubscribers.length > 0) {
            const subscriber = this._pendingSubscribers.pop()!
            const index = this._subscribers.indexOf(subscriber)

            if (index > -1)
                this._subscribers.splice(index, 1)
        }
    }

    subscribe(subscriber: (value: T) => void, dispatch = true) {
        this._subscribers.push(subscriber)

        if (dispatch)
            subscriber(this._value)
    }

    unsubscribe(subscriber: (value: T) => void) {
        if (this._dispatching) {
            this._pendingSubscribers.push(subscriber)
            return
        }

        const index = this._subscribers.indexOf(subscriber)

        if (index > -1)
            this._subscribers.splice(index, 1)
    }

    map<U>(transform: (value: T) => U): Observable<U> {
        const observable = new Observable(transform(this._value))

        this.subscribe(value => observable.value = transform(value))

        return observable
    }

    pipe<U>(transformer: Transformer<T, U>): Observable.Pipe<T, U> {
        return new Observable.Pipe(this, transformer)
    }

    destroy() {
        if (this._destroyed)
            return

        this._subscribers = []
        this._pendingSubscribers = []

        this._destroyed = true

        this._onDestroy?.()
    }

}

export namespace Observable {

    export class Pipe<T, U> {

        constructor(
            private readonly _observable: Observable<T>,
            private readonly _transformer: Transformer<T, U>
        ) { }

        pipe<V>(transformer: Transformer<U, V>): Pipe<T, V> {
            const chainedTransformer = Transformer.Utils.chain<T, U, V>(this._transformer, transformer)

            const pipe = new Pipe<T, V>(this._observable, chainedTransformer)

            return pipe
        }

        observable(): Observable<U> {
            const onEvent = (value: T) => {
                this._transformer.event(
                    value, 
                    dispatched => observable.value = dispatched
                )
            }

            const observable = new Observable<U>(
                this._transformer.map(this._observable.value),
                () => this._observable.unsubscribe(onEvent)
            )

            this._observable.subscribe(onEvent, false)

            return observable
        }

    }

}

export namespace Observable {

    export function fromPromise<T>(promise: Promise<T>): Observable<T | undefined> {
        const observable = new Observable<T | undefined>(undefined)

        promise.then(value => observable.value = value)

        return observable
    }

    export function interval(delayInMilliseconds: number): Observable<number> {
        const interval: number = setInterval(() => observable.value++, delayInMilliseconds, undefined)

        const observable = new Observable<number>(
            0,
            () => clearInterval(interval)
        )

        return observable
    }

}