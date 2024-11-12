import { Model, SyncObject, SyncObjectType } from "@niloc/core";
import { useEffect, useState } from "react";

export function useObjects<T extends SyncObject>(model: Model, type: SyncObjectType<T>): T[] {
    const [objects, setObjects] = useState<T[]>([])

    useEffect(() => {
        function update() {
            setObjects(model.getAll().filter((object): object is T => (object instanceof type && !object.deleted)))
        }

        model.on('created', update)
        model.on('deleted', update)
        
        update()
        
        return () => {
            model.off('created', update)
            model.off('deleted', update)
        }
    }, [model, type])

    return objects
}