import { Emitter } from "../Emitter";
import { StoreObject } from "./StoreObject";
type Id<T> = T extends {
    id: infer U;
} ? U : never;
type Events<T> = {
    change: Store.ChangeEvent<T>;
    delete: T;
};
export declare class Store<T extends StoreObject> extends Emitter<Events<T>> {
    private _objects;
    objects(): IterableIterator<T>;
    update(object: T): void;
    delete(id: Id<T>): void;
    getById(id: Id<T>): T | null;
    getAll(): any;
}
export declare namespace Store {
    type ChangeEvent<T> = {
        value: T;
        previous: T | null;
    };
}
export {};
