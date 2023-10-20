import { SyncObject } from "../sync/SyncObject";
import { Plugin } from "../sync/Plugin";
import { RPCHandler } from "./RPCHandler";
export declare class RPCPlugin implements Plugin {
    private _handler;
    constructor(rpcHandler: RPCHandler);
    beforeCreate<T extends SyncObject>(object: T): void;
}
