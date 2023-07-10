import { Context } from "../core/Context"
import { SyncObject } from "./SyncObject"

export type AuthorityHandler<T extends SyncObject> = true | ((object: T, context: Context) => boolean)

export namespace Authority {

    /**
     * @returns Returns an authority handler that allows changes if the user is a host
     */
    export function host(): AuthorityHandler<any> {
        return (_, context) => context.host
    }

    /**
     * @returns an authority handler that allows changes if the user is the owner of the object (if the object's id is equal to the user's id)
     */
    export function own(): AuthorityHandler<SyncObject> {
        return (object, context) => object.id() === context.userId
    }

    export function allows(authority: AuthorityHandler<SyncObject>, object: SyncObject, context: Context) {
        return authority === true || authority(object, context)
    }

}