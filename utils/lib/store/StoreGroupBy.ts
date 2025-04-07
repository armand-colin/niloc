import { Id } from "./Id";
import type { Store } from "./Store";
import { StoreObject } from "./StoreObject";

export class StoreGroupBy<
    M extends StoreObject,
    T extends StoreObject,
    K extends keyof T,
> {

    private _objects = new Map<T[K], Map<Id<T>, T>>()

    constructor(
        protected readonly master: Store<M>,
        protected readonly slave: Store<T>,
        protected readonly key: keyof T
    ) {
        // initial build
        for (const object of slave.objects()) {
            const index = object[this.key] as T[K]
            this._addToIndex(object, index)
        }
        
        slave.on('change', this._onSlaveChange)
    }

    private _onSlaveChange = (event: Store.ChangeEvent<T>) => {
        const index = event.value[this.key] as T[K]

        if (event.previous) {
            const previousIndex = event.previous[this.key] as T[K]
            if (previousIndex !== index)
                this._deleteFromIndex(event.previous.id as Id<T>, previousIndex)
        }

        this._addToIndex(event.value, index)
    }

    private _deleteFromIndex(id: Id<T>, index: T[K]) {
        const map = this._objects.get(index)

        if (!map)
            return

        map.delete(id)

        if (map.size === 0)
            this._objects.delete(index)
    }

    private _addToIndex(object: T, index: T[K]) {
        let map = this._objects.get(index)

        if (!map) {
            map = new Map()
            this._objects.set(index, map)
        }

        map.set(object.id as Id<T>, object)
    }

}