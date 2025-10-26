import type { Component } from "./Component";
import type { ComponentConstructor, ResourceConstructor } from "./Constructor";
import { Coroutine } from "./Coroutine";
import type { Resource } from "./Resource";
import type { Schedule } from "./Schedule";
import { Scheduler } from "./Scheduler";

export type Initializer<T> = (engine: Engine) => T

export class Engine {

    private _resources = new Map<ResourceConstructor, Resource>()
    private _scheduler = new Scheduler()
    private _initializers = new Map<ResourceConstructor, Initializer<unknown>>()

    getResource<T extends Resource>(constructor: ResourceConstructor<T>): T {
        if (this._resources.has(constructor))
            return this._resources.get(constructor) as T

        if (this._initializers.has(constructor)) {
            const instance = this._initializers.get(constructor)!(this) as T
            this._resources.set(constructor, instance)
            return instance
        }

        if (constructor.length > 1) {
            throw new Error("Resource has no initializer, but constructor needs more than one argument")
        }

        const resource = new constructor(this)
        this._resources.set(constructor, resource)

        return resource
    }

    initializeResource<T extends Resource>(constructor: ResourceConstructor<T>, initializer: Initializer<T>) {
        this._initializers.set(constructor, initializer)
    }

    createComponent<T extends Component, Args extends unknown[]>(constructor: ComponentConstructor<T, Args>, ...args: Args): T {
        const component = new constructor(this, ...args)
        return component
    }

    startCoroutine(coroutine: Iterator<Schedule>) {
        const _coroutine = new Coroutine(coroutine)
        this._scheduler.add(_coroutine)
        return _coroutine
    }

}