type Constructor<T> = { new(): T } | { new(injector: Provider): T }

export class Provider {

    private _types = new Map<Constructor<any>, any>()
    private _history: Constructor<any>[]= []

    get<T>(type: Constructor<T>): T {
        return this._get(type)
    }

    set<T>(type: Constructor<T>, instance: any) {
        this._types.set(type, instance)
    }

    private _get<T>(type: Constructor<T>, history: Constructor<any>[] = []): T {
        if (!this._types.has(type)) {
            if (this._history.includes(type)) {
                const path = history.map(t => t.name).join(' -> ')
                throw new Error(`Circular dependency detected for ${type.name}: ${path}`)
            }

            this._history.push(type)
            const instance = new type(this)
            this._types.set(type, instance)
            this._history.pop()
            return instance
        }

        return this._types.get(type)
    }   

}