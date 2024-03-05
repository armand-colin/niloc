import { SyncObject } from "@niloc/core";
import { useEffect, useReducer } from "react";

export function useSyncObject<T extends SyncObject>(object: T): T {
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        object.registerAll(forceUpdate)

        return () => {
            object.unregisterAll(forceUpdate)
        }
    }, [object])

    return object
}