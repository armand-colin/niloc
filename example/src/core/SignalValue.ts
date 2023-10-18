import { Signal, createSignal } from "solid-js"

export class SignalValue<T> {

    private _signal: Signal<T>

    constructor(initialValue: T) {
        this._signal = createSignal(initialValue)
    }

    get(): T {
        return this._signal[0]()
    }

    set(value: T) {
        this._signal[1](() => value)
    }

}