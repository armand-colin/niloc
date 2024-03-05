import { Authority } from "../Authority";
import { Plugin } from "../Plugin";
import { SyncObject } from "../SyncObject";

export class OwnerAuthorityPlugin implements Plugin {

    beforeCreate<T extends SyncObject>(object: T): void {
        object.authority = Authority.Owner
    }

}