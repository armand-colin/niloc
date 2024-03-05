import { Identity } from "../core/Identity"
import { SyncObject } from "./SyncObject"

export enum Authority {
    All,
    Host,
    Owner,
}

export namespace Authority {

    export function allows(object: SyncObject, context: Identity) {
        switch (object.authority) {
            case Authority.All:
                return true
            case Authority.Host:
                return context.host
            case Authority.Owner:
                return context.userId === object.id
        }

        return false
    }

}