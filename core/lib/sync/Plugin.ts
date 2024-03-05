import { IModel } from "./Model.interface";
import { SyncObject } from "./SyncObject";

export interface Plugin {
    
    init?(model: IModel): void
    beforeCreate?<T extends SyncObject>(object: T): void

}