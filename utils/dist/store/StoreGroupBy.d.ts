import type { Store } from "./Store";
import { StoreObject } from "./StoreObject";
export declare class StoreGroupBy<M extends StoreObject, T extends StoreObject, K extends keyof T> {
    protected readonly master: Store<M>;
    protected readonly slave: Store<T>;
    protected readonly key: keyof T;
    private _objects;
    constructor(master: Store<M>, slave: Store<T>, key: keyof T);
    private _onSlaveChange;
    private _deleteFromIndex;
    private _addToIndex;
}
