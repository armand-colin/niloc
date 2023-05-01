import { Channel } from "../channel/DataChannel";
import { Peer, SyncObject } from "../main";
import { Plugin } from "../sync/Plugin";
export declare class RPCPlugin implements Plugin {
    private _handler;
    constructor(self: Peer, channel: Channel<any>);
    beforeCreate<T extends SyncObject>(object: T): void;
}
