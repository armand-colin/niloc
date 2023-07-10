import { AuthorityHandler } from "./Authority";
import { SyncObject } from "./SyncObject";
export type Template<T extends SyncObject> = {
    readonly type: string;
    create(id: string): T;
    authority: AuthorityHandler<T>;
};
export declare namespace Template {
    function create<T extends SyncObject>(type: string, factory: {
        new (id: string, type: string): T;
    }, authority?: AuthorityHandler<T>): Template<T>;
}
