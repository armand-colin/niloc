import { Component } from "@niloc/ecs";
import { useEffect, useReducer } from "react";

export function useComponent<T extends Component>(component: T) {
    const [_, forceUpdate] = useReducer(x => x + 1, 0)
    
    useEffect(() => {
        component.on('change', forceUpdate)
        return () => {
            component.off('change', forceUpdate)
        }
    }, [component])

    return component
}