import { useEffect, useReducer } from "react";
import type { Action } from "./Action";
import type { Component } from "./Component";
import type { ResourceConstructor } from "./Constructor";
import { Engine } from "./Engine";
import type { Resource } from "./Resource";

export function useResource<T extends Resource>(constructor: ResourceConstructor<T>): T {
    const resource = Engine.instance.getResource(constructor)
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        resource.on('change', forceUpdate)
        return () => {
            resource.off('change', forceUpdate)
        }
    }, [resource])

    return resource
}

export function useAction<T>(action: Action<T>, callback: (event: T) => void, dependencies?: unknown[]) {
    useEffect(() => {
        action.register(callback)

        return () => {
            action.unregister(callback)
        }
    }, [action, ...(dependencies ?? [])])
}

export function useComponent<T extends Component>(component: T): T {
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        component.on('change', forceUpdate)
        return () => {
            component.off('change', forceUpdate)
        }
    }, [component])

    return component
}