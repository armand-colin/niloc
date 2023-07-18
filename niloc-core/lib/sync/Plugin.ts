import { ModelHandle } from "./ModelHandle";
import { SyncObject } from "./SyncObject";

export interface Plugin {
    
    init?(model: ModelHandle): void
    beforeCreate?<T extends SyncObject>(object: T): void

}