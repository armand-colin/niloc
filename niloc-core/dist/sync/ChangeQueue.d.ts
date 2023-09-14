export declare class ChangeQueue {
    private _changes;
    private _syncs;
    change(objectId: string, fieldIndex: number): void;
    sync(objectId: string): void;
    changes(): Iterable<{
        objectId: string;
        fields: number[];
    }>;
    syncs(): Iterable<string>;
    changeForObject(objectId: string): number[] | null;
}
