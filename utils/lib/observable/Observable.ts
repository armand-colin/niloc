import type { Transformer } from './Transformer'

export class Observable<T> {

    private _value: T
    private _subscribers: ((value: T) => void)[] = []

    private _dispatching = false
    private _pendingSubscribers: ((value: T) => void)[] = []

    constructor(value: T) {
        this._value = value
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
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

    subscribe(subscriber: (value: T) => void) {
        this._subscribers.push(subscriber)
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

    pipe<U>(transformer: Transformer<T, U>): Observable<U> {
        return transformer(this)
    }

}