import { AuthorityHandler } from "./Authority";
import { SyncObject } from "./SyncObject";
export type Template<T extends SyncObject> = {
    readonly type: string;
    create(id: string): T;
    authority: AuthorityHandler<T>;
};
export type Factory<T extends SyncObject> = {
    new (id: string, type: string): T;
};
export declare namespace Template {
    function create<T extends SyncObject>(type: string, factory: Factory<T>, authority?: AuthorityHandler<T>): Template<T>;
}
