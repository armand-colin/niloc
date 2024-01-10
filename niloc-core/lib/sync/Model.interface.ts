import { SyncObject } from "./SyncObject"
import { Plugin } from "./Plugin"
import type { IEmitter } from "@niloc/utils"
import { Address } from "../core/Address"
import { SyncObjectType } from "./SyncObjectType"
import { ChangeQueue } from "./ChangeQueue"
import { Identity } from "../main"

export interface ModelEvents {
    created: SyncObject,
    deleted: string
}

export type ObjectRequest = {
    dispose(): void
}

export interface Model extends IEmitter<ModelEvents> {

    changeQueue: ChangeQueue
    identity: Identity
    
    addType<T extends SyncObject>(type: SyncObjectType<T>, typeId?: string): void

    instantiate<T extends SyncObject>(type: SyncObjectType<T>, id?: string): T

    get<T extends SyncObject>(id: string): T | null
    getAll(): SyncObject[]

    addPlugin(plugin: Plugin): this
    
    send(): void
    sync(address: Address): void

    registerObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): void
    unregisterObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): void

}