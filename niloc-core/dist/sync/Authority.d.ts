import { Context } from "../core/Context";
import { SyncObject } from "./SyncObject";
export type AuthorityHandler<T extends SyncObject> = true | ((object: T, context: Context) => boolean);
export declare namespace Authority {
    /**
     * @returns Returns an authority handler that allows changes if the user is a host
     */
    function host(): AuthorityHandler<any>;
    /**
     * @returns an authority handler that allows changes if the user is the owner of the object (if the object's id is equal to the user's id)
     */
    function own(): AuthorityHandler<SyncObject>;
    function allows(authority: AuthorityHandler<SyncObject>, object: SyncObject, context: Context): boolean;
}
