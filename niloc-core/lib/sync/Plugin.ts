import { SyncObject } from "./SyncObject";

export interface Plugin {
    
    beforeCreate?<T extends SyncObject>(object: T): void

}