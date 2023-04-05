import { SyncObject } from "./SyncObject"

export type Template<T extends SyncObject> = {
    
    readonly type: string
    create(): T

}