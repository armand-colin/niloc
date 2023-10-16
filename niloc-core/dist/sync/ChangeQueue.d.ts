import type { Emitter } from "@niloc/utils";
type Events = {
    needsSend: void;
};
export declare class ChangeQueue {
    private _changes;
    private _syncs;
    private _emitter;
    emitter(): Emitter<Events>;
    needsSend(): boolean;
    change(objectId: string, fieldIndex: number): void;
    sync(objectId: string): void;
    changes(): Iterable<{
        objectId: string;
        fields: number[];
    }>;
    syncs(): Iterable<string>;
    changeForObject(objectId: string): number[] | null;
}
export {};
