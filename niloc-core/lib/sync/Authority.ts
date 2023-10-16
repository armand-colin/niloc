import { Context } from "../core/Context"
import { SyncObject } from "./SyncObject"

export enum Authority {
    All,
    Host,
    Owner,
}

export namespace Authority {
    
    export function allows(object: SyncObject, context: Context) {
        switch (object.authority) {
            case Authority.All:
                return true
            case Authority.Host:
                return context.host
            case Authority.Owner:
                return context.userId === object.id()
        }
        
        return false
    }

}