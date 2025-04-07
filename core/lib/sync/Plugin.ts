import type { Model } from "./Model";
import { SyncObject } from "./SyncObject";

export interface Plugin {
    
    init?(model: Model): void
    beforeCreate?<T extends SyncObject>(object: T): void

}