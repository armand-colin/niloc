import type { Emitter } from "@niloc/utils";
import { ModelEvents } from "./Model";
import { SyncObject } from "./SyncObject";
import { Address, Context } from "../main";
export interface ModelHandle {
    emitter(): Emitter<ModelEvents>;
    context(): Context;
    get<T extends SyncObject>(id: string): T | null;
    syncTo(address: Address): void;
    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ModelHandle.ObjectRequest;
}
interface ModelHandleOpts {
    emitter: Emitter<ModelEvents>;
    context: Context;
    get<T extends SyncObject>(id: string): T | null;
    syncTo(address: Address): void;
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
