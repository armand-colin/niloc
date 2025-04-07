import { Emitter } from "../Emitter";
import { StoreObject } from "./StoreObject";

type Id<T> = T extends { id: infer U } ? U : never

type Events<T> = {
    change: Store.ChangeEvent<T>,
    delete: T
}

export class Store<T extends StoreObject> extends Emitter<Events<T>> {

    private _objects = new Map<Id<T>, T>();

    objects() {
        return this._objects.values()
    }

    update(object: T) {
        const previous = this._objects.get(object.id as Id<T>) ?? null
        this._objects.set(object.id as Id<T>, object)
        this.emit('change', { value: object, previous })
    }

    delete(id: Id<T>) {
        const current = this._objects.get(id)
        if (!current)
            return

        this._objects.delete(id)
        this.emit('delete', current)
    }

    getById(id: Id<T>): T | null {
        return this._objects.get(id) ?? null
    }

    getAll() {
        return this._objects.values().toArray()
    }

}

export namespace Store {
    export type ChangeEvent<T> = {
        value: T,
        previous: T | null
    }
}