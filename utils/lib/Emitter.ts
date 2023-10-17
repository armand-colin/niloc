type Callback<T> = T extends void ? (data?: T) => void : (data: T) => void

type VoidKeys<T> = {
    [K in keyof T]: T[K] extends void ? K : never
}[keyof T]

export interface IEmitter<Events> {

    once<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void
    off<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void
    on<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void
    offOnce<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void
    emit<K extends VoidKeys<Events>>(event: K): void
    emit<K extends keyof Events & string>(event: K, data: Events[K]): void
    removeAllListeners(): void

}

export class Emitter<Events> implements IEmitter<Events> {

    private _listeners: Record<string, Set<(data: any) => void>> = {}
    private _onceListeners: Record<string, Set<(data: any) => void>> = {}

    on<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void {
        if (!this._listeners[event])
            this._listeners[event] = new Set()
        this._listeners[event].add(callback)
    }

    off<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void {
        if (!this._listeners[event])
            return
        this._listeners[event].delete(callback)
        if (this._listeners[event].size === 0)
            delete this._listeners[event]
    }

    once<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void {
        if (!this._onceListeners[event])
            this._onceListeners[event] = new Set()
        this._onceListeners[event].add(callback)
    }

    offOnce<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void {
        if (!this._onceListeners[event])
            return
        this._onceListeners[event].delete(callback)
        if (this._onceListeners[event].size === 0)
            delete this._onceListeners[event]
    }

    emit<K extends VoidKeys<Events>>(event: K): void
    emit<K extends keyof Events & string>(event: K, data: Events[K]): void
    emit<K extends keyof Events & string>(event: K, data?: any): void {
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