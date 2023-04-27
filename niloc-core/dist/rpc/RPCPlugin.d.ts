import { Channel } from "../channel/DataChannel";
import { SyncObject } from "../main";
import { Plugin } from "../sync/Plugin";
export declare class RPCPlugin implements Plugin {
    private _handler;
    constructor(id: string, channel: Channel<any>);
    beforeCreate<T extends SyncObject>(object: T): void;
}
