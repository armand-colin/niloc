type UndefinedKeysOf<T> = {
    [K in keyof T]: T[K] extends undefined ? K :
    T[K] extends void ?
    K :
    never
}[keyof T]

export interface IEmitter<Events extends Record<string, any>> {

    once<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void
    off<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void
    on<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void
    offOnce<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void
    emit<K extends keyof Events>(event: K, data: Events[K]): void
    removeAllListeners(): void

}

export class Emitter<Events extends Record<string, any>> implements IEmitter<Events> {

    private _listeners: Partial<Record<keyof Events, Set<(data: any) => void>>> = {}
    private _onceListeners: Partial<Record<keyof Events, Set<(data: any) => void>>> = {}

    on<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void {
        if (!this._listeners[event])
            this._listeners[event] = new Set()
        this._listeners[event].add(callback)
    }

    off<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void {
        if (!this._listeners[event])
            return
        this._listeners[event].delete(callback)
        if (this._listeners[event].size === 0)
            delete this._listeners[event]
    }

    once<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void {
        if (!this._onceListeners[event])
            this._onceListeners[event] = new Set()
        this._onceListeners[event].add(callback)
    }

    offOnce<K extends keyof Events>(event: K, callback: Emitter.Callback<Events, K>): void {
        if (!this._onceListeners[event])
            return
        this._onceListeners[event].delete(callback)
        if (this._onceListeners[event].size === 0)
            delete this._onceListeners[event]
    }

    emit<K extends keyof Events>(event: K, data: Events[K]): void
    emit<K extends UndefinedKeysOf<Events>>(event: K): void
    emit<K extends keyof Events>(event: K, data?: Events[K]): void {
        if (this._listeners[event]) {
            for (const callback of [...this._listeners[event]])
                callback(data)
        }
        if (this._onceListeners[event]) {
            for (const callback of [...this._onceListeners[event]])
                callback(data)
            delete this._onceListeners[event]
        }
    }

    removeAllListeners(): void {
        this._listeners = {}
        this._onceListeners = {}
    }

}

export namespace Emitter {

    export type Callback<Events, Name extends keyof Events> = (data: Events[Name]) => void

}