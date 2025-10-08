import { Provider } from "@niloc/utils";
import type { Resource } from "./Resource";
import { Scene } from "./Scene";

export class Engine {

    private _resources = new Provider<Resource, [Engine]>()
    private _loaders = new Map<Provider.Constructor<Resource>, (engine: Engine) => Resource>()
    private _scene = new Scene()

    resource<T extends Resource>(constructor: Provider.Constructor<T>): T {
        if (this._resources.has(constructor))
            return this._resources.get(constructor, this) as T

        if (this._loaders.has(constructor)) {
            const instance = this._loaders.get(constructor)!(this)
            this._resources.set(constructor, instance)
            return instance as T
        }

        return this._resources.get(constructor, this)
    }

    initialize<T extends Resource>(constructor: Provider.Constructor<T>, loader: (engine: Engine) => T): void
    initialize<T extends Resource>(constructor: Provider.Constructor<T, [Engine]>): void
    initialize<T extends Resource>(constructor: Provider.Constructor<T>, loader?: (engine: Engine) => T) {
        if (loader) {
            this._loaders.set(constructor, loader)
            return
        }
    }

}

export namespace Engine {
    export type Constructor<T> = Provider.Constructor<T, [Engine]>
}