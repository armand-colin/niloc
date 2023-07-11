import { Channel } from "../channel/Channel";
import { Peer } from "../core/Peer";
import { SyncObject } from "../sync/SyncObject";
import { Plugin } from "../sync/Plugin";
export declare class RPCPlugin implements Plugin {
    private _handler;
    constructor(self: Peer, channel: Channel<any>);
    beforeCreate<T extends SyncObject>(object: T): void;
}
