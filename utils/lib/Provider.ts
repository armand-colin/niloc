import { Emitter } from "./Emitter"

type AnyConstructor<T = any> = Provider.Constructor<T> | Provider.AsyncConstructor<T>

type LockEvents = {
    lock: void,
    unlock: void
}

export class Provider {

    private _types = new Map<AnyConstructor, any>()
    private _history: AnyConstructor[] = []

    private _lockEmitter = new Emitter<LockEvents>()
    private _locked = false

    get<T>(type: Provider.Constructor<T>): T {
        return this._get(type)
    }

    set<T>(type: AnyConstructor<T>, instance: T) {
        this._types.set(type, instance)
    }

    lock() {
        if (this._locked)
            throw new Error("Trying to lock provider althrough it has already been locked.")

        this._locked = true
    }

    unlock() {
        if (!this._locked)
            throw new Error("Trying to unlock provider althrough it has not been locked.")

        this._locked = false
    }

    private async _waitForRelease(): Promise<void> {
        if (!this._locked)
            return

        return new Promise(resolve => {
            const onUnlock = () => {
                this._lockEmitter.off("unlock", onUnlock)
                resolve()
            }

            this._lockEmitter.on('unlock', onUnlock)
        })        
    }

    async getAsync<T>(type: Provider.AsyncConstructor<T>): Promise<T> {
        await this._waitForRelease()

        if (this._types.has(type))
            return this._types.get(type)

        this._addToHistory(type)

        const instance = await type.asyncConstructor(this)
        this._types.set(type, instance)

        this._removeFromHistory(type)

        return instance
    }

    private _addToHistory(type: AnyConstructor) {
        if (this._history.includes(type)) {
            const path = this._history.map(t => t.name).join(' -> ')
            throw new Error(`Circular dependency detected for ${type.name}: ${path}`)
        }

        this._history.push(type)
    }

    private _removeFromHistory(type: AnyConstructor) {
        const index = this._history.indexOf(type)
        if (index > -1)
            this._history.splice(index, 1)
    }

    private _get<T>(type: Provider.Constructor<T>): T {
        if (this._types.has(type))
            return this._types.get(type)

        this._addToHistory(type)

        const instance = new type(this)
        this._types.set(type, instance)

        this._removeFromHistory(type)

        return instance
    }

}

export namespace Provider {

    export type Constructor<T> = {
        name: string
        new(): T
    } | {
        name: string
        new(provider: Provider): T
    }

    export type AsyncConstructor<T> = {
        name: string,
        asyncConstructor(provider: Provider): Promise<T>
    } | {
        name: string,
        asyncConstructor(): Promise<T>
    }

}