import { Model } from "./Model.interface";
import { SyncObject } from "./SyncObject";

export interface Plugin {
    
    init?(model: Model): void
    beforeCreate?<T extends SyncObject>(object: T): void

}