import type { Network } from "../core/Network";
import { SyncObjectType } from "../sync/SyncObjectType";
import { Model } from "../sync/Model";
import { Presence } from "../sync/presence/Presence";
import { SyncObject } from "../sync/SyncObject";
import { ConnectionList } from "../sync/presence/ConnectionList";
import { RPCHandler } from "../rpc/RPCHandler";
import { Router } from "../core/Router";
export type FrameworkOptions<P extends SyncObject> = {
    id: string;
    host: boolean;
    relay?: boolean;
    network: Network;
    presenceType: SyncObjectType<P>;
    connectionList?: ConnectionList;
};
export declare enum FrameworkChannels {
    ConnectionList = 31,
    Presence = 30,
    RPC = 29,
    Model = 28
}
export declare class Framework<P extends SyncObject> {
    readonly network: Network;
    readonly router: Router;
    readonly connectionList: ConnectionList;
    readonly presence: Presence<P>;
    readonly rpcHandler: RPCHandler;
    readonly model: Model;
    constructor(options: FrameworkOptions<P>);
}
