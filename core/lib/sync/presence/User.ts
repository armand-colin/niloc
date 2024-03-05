import { Identity } from "../../core/Identity";
import { SyncObject } from "../SyncObject";

export class User extends SyncObject {

    static __setIdentity(user: User, identity: Identity) {
        user._identity = identity
    }

    private _identity: Identity = new Identity(this.id)

    get identity() {
        return this._identity
    }

}