import { SyncObject } from "./SyncObject"

export type Template<T extends SyncObject> = {

    readonly type: string
    create(id: string): T

}

export namespace Template {

    export function create<T extends SyncObject>(type: string, factory: { new(id: string, type: string): T }): Template<T> {
        return {
            type,
            create: (id) => new factory(id, type)
        }
    }

}