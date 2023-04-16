import { Model, SyncObject } from "niloc-core";
import { useEffect, useMemo, useReducer, useRef } from "react";

export function useObject<T extends SyncObject>(model: Model, id: string): T | null {
    const object = useRef<T | null>(null)
    const [_, forceUpdate] = useReducer(x => x + 1, 0)

    useMemo(() => {
        object.current = model.get(id)
    }, [id])

    useEffect(() => {
        function onCreated(newObject: SyncObject) {
            if (newObject.id() === id) {
                object.current = newObject as T
                forceUpdate()
            }
        }
        model.emitter().on('created', onCreated)

        return () => {
            model.emitter().off('created', onCreated)
        }
    }, [id])

    return object.current
}