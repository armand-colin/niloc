import type { Component } from "./Component"
import type { Engine } from "./Engine"
import type { Resource } from "./Resource"

type Constructor<T, Args extends unknown[]> = {
    new(...args: Args): T
}

export type ResourceConstructor<T extends Resource = Resource> = Constructor<T, [Engine]>

export type ComponentConstructor<T extends Component = Component, Args extends unknown[] = unknown[]> = {
    new(engine: Engine, ...args: Args): T
}