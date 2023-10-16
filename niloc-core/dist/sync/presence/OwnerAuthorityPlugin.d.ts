import { Plugin } from "../Plugin";
import { SyncObject } from "../SyncObject";
export declare class OwnerAuthorityPlugin implements Plugin {
    beforeCreate<T extends SyncObject>(object: T): void;
}
