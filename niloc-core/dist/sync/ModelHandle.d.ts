import { Emitter } from "../main";
import { ModelEvents } from "./Model";
import { SyncObject } from "./SyncObject";
export interface ModelHandle {
    emitter(): Emitter<ModelEvents>;
    get<T extends SyncObject>(id: string): T | null;
    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ModelHandle.ObjectRequest;
}
interface ModelHandleOpts {
    emitter: Emitter<ModelEvents>;
    get<T extends SyncObject>(id: string): T | null;
    objectsEmitter: Emitter<{
        [key: string]: SyncObject | null;
    }>;
}
export declare namespace ModelHandle {
    interface ObjectRequest {
        destroy(): void;
    }
    function make(options: ModelHandleOpts): ModelHandle;
}
export {};
