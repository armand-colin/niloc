import { Emitter } from "./Emitter"

type LockEvents = {
    lock: void,
    unlock: void
}

export class Provider<T = any, Args extends any[] = []> {

    private _types = new Map<Provider.AnyConstructor<T, Args>, any>()
    private _history: Provider.AnyConstructor<T, Args>[] = []

    private _lockEmitter = new Emitter<LockEvents>()
    private _locked = false

    get<Instance extends T>(type: Provider.Constructor<Instance, Args>, ...args: Args): Instance {
        return this._get(type, ...args) as Instance
    }

    set<Instance extends T>(type: Provider.AnyConstructor<Instance, Args>, instance: Instance) {
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

    async getAsync<Instance extends T>(type: Provider.AsyncConstructor<Instance, Args>, ...args: Args): Promise<Instance> {
        await this._waitForRelease()

        if (this._types.has(type))
            return this._types.get(type)

        this._addToHistory(type)

        const instance = await type.asyncConstructor(...args)
        this._types.set(type, instance)

        this._removeFromHistory(type)

        return instance
    }

    private _addToHistory(type: Provider.AnyConstructor<T, Args>) {
        if (this._history.includes(type)) {
            const path = this._history.map(t => t.name).join(' -> ')
            throw new Error(`Circular dependency detected for ${type.name}: ${path}`)
        }

        this._history.push(type)
    }

    private _removeFromHistory(type: Provider.AnyConstructor<T, Args>) {
        const index = this._history.indexOf(type)
        if (index > -1)
            this._history.splice(index, 1)
    }

    private _get<Instance extends T>(type: Provider.Constructor<Instance, Args>, ...args: Args): Instance {
        if (this._types.has(type))
            return this._types.get(type)

        this._addToHistory(type)

        const instance = new type(...args)
        this._types.set(type, instance)

        this._removeFromHistory(type)

        return instance
    }

}

export namespace Provider {

    export type Constructor<T, Args extends any[] = []> = {
        name: string
        new(...args: Args): T
    }

    export type AsyncConstructor<T, Args extends any[] = []> = {
        name: string,
        asyncConstructor(...args: Args): Promise<T>
    }

    export type AnyConstructor<T, Args extends any[] = []> = Constructor<T, Args> | AsyncConstructor<T, Args>

}