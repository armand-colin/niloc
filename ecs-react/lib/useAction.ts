import { Action } from "@niloc/ecs";
import { useEffect } from "react";

export function useAction<T>(action: Action<T>, callback: (data: T) => void, dependencies: any[] = []) {
    useEffect(() => {
        action.register(callback)

        return () => {
            action.unregister(callback)
        }
    }, [action, ...dependencies])
}