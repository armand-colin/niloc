import type { Emitter } from "@niloc/utils";
import { ModelEvents } from "./Model";
import { SyncObject } from "./SyncObject";
import { Address, Context } from "../main";
import { ChangeQueue } from "./ChangeQueue";
export interface ModelHandle {
    emitter(): Emitter<ModelEvents>;
    context(): Context;
    get<T extends SyncObject>(id: string): T | null;
    syncTo(address: Address): void;
    requestObject<T extends SyncObject>(id: string, callback: (object: T | null) => void): ModelHandle.ObjectRequest;
    changeQueue(): ChangeQueue;
    send(): void;
}
interface ModelHandleOpts {
    emitter: Emitter<ModelEvents>;
    context: Context;
    get<T extends SyncObject>(id: string): T | null;
    syncTo(address: Address): void;
    objectsEmitter: Emitter<{
        [key: string]: SyncObject | null;
    }>;
    changeQueue: ChangeQueue;
    send(): void;
}
export declare namespace ModelHandle {
    interface ObjectRequest {
        destroy(): void;
    }
    function make(options: ModelHandleOpts): ModelHandle;
}
export {};
