import { SyncObject } from "./SyncObject"
import { Plugin } from "./Plugin"
import type { IEmitter } from "@niloc/utils"
import { Address } from "../core/Address"
import { SyncObjectType } from "./SyncObjectType"
import { ChangeQueue } from "./ChangeQueue"

export interface ModelEvents {
    created: SyncObject,
    deleted: string
}

export type ObjectRequest = {
    dispose(): void
}

export interface Model {

    emitter(): IEmitter<ModelEvents>
    changeQueue(): ChangeQueue
    register<T extends SyncObject>(type: SyncObjectType<T>, typeId?: string): void
    get<T extends SyncObject>(id: string): T | null
    getAll(): SyncObject[]
    plugin(plugin: Plugin): void
    instantiate<T extends SyncObject>(type: SyncObjectType<T>, id?: string): T
    send(): void
    syncTo(address: Address): void
    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ObjectRequest

}