import { Emitter } from "utils";
import { ModelEvents } from "./Model";
import { SyncObject } from "./SyncObject";

export interface ModelHandle {

    emitter(): Emitter<ModelEvents>
    get<T extends SyncObject>(id: string): T | null
    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ModelHandle.ObjectRequest

}

interface ModelHandleOpts {
    emitter: Emitter<ModelEvents>,
    get<T extends SyncObject>(id: string): T | null,
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