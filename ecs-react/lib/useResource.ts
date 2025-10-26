import { Resource, ResourceConstructor } from "@niloc/ecs";
import { useContext, useEffect, useReducer } from "react";
import { EngineContext } from "./EngineContext";

export function useResource<T extends Resource>(constructor: ResourceConstructor<T>): T {
    const { engine } = useContext(EngineContext)
    const [_, forceUpdate] = useReducer(x => x + 1, 0)

    if (!engine)
        throw new Error("No engine available in context")

    const resource = engine.getResource(constructor)

    useEffect(() => {
        resource.on('change', forceUpdate)
        
        return () => {
            resource.off('change', forceUpdate)
        }
    }, [engine, resource])

    return resource
}