import { Field } from "niloc-core";
import { useEffect, useReducer } from "react";

export function useField(field: Field) {
    const [_, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        field.emitter().on('changed', forceUpdate)
        return () => {
            field.emitter().off('changed', forceUpdate)
        }
    }, [])
}