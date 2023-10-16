import { Context } from "../core/Context";
import { SyncObject } from "./SyncObject";
export declare enum Authority {
    All = 0,
    Host = 1,
    Owner = 2
}
export declare namespace Authority {
    function allows(object: SyncObject, context: Context): boolean;
}
