import type { Emitter } from "@niloc/utils";
import { ModelEvents } from "./Model";
import { SyncObject } from "./SyncObject";
import { Address, Context } from "../main";

export interface ModelHandle {

    emitter(): Emitter<ModelEvents>
    context(): Context
    get<T extends SyncObject>(id: string): T | null
    syncTo(address: Address): void
    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ModelHandle.ObjectRequest

}

interface ModelHandleOpts {
    emitter: Emitter<ModelEvents>,
    context: Context,
    get<T extends SyncObject>(id: string): T | null,
    syncTo(address: Address): void,
    objectsEmitter: Emitter<{ [key: string]: SyncObject | null }>
}

export namespace ModelHandle {

    export interface ObjectRequest {
    
        destroy(): void
    
    }

    export function make(options: ModelHandleOpts) {
        const handle: ModelHandle = {
            emitter() {
                return options.emitter
            },
            context() {
                return options.context
            },
            syncTo: options.syncTo,
            get: options.get,
            requestObject(id, callback) {
                options.objectsEmitter.on(id, callback)
                callback(options.get(id))

                const request: ObjectRequest = {
                    destroy() {
                        options.objectsEmitter.off(id, callback)
                    }
                }

                return request
            }
        }

        return handle
    }

}