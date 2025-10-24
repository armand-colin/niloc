import { Emitter } from "@niloc/utils";

export class Action<T = void> {

    private readonly _emitter = new Emitter<{ event: T }>()

    register(callback: (event: T) => void) {
        this._emitter.on('event', callback)
    }

    unregister(callback: (event: T) => void) {
        this._emitter.off('event', callback)
    }

    publish(event: T) {
        this._emitter.emit("event", event)
    }

}