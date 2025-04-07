import { Field, SyncObject } from "@niloc/core";
import { useEffect, useReducer } from "react";

export function useObject(object: SyncObject) {
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        const escape = Field.register(object.fields(), forceUpdate)

        return () => {
            escape()
        }
    }, [object])
}