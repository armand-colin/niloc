import { Channel } from "../channel/Channel";
import { Peer } from "../core/Peer";
import { SyncObject } from "../sync/SyncObject";
import { Plugin } from "../sync/Plugin";
import { RPC } from "./RPC";
import { RPCHandler } from "./RPCHandler";

export class RPCPlugin implements Plugin {

    private _handler: RPCHandler

    constructor(self: Peer, channel: Channel<any>) {
        this._handler = new RPCHandler(self, channel)
    }

    beforeCreate<T extends SyncObject>(object: T): void {
        let i = 0
        for (const key in object) {
            const rpc = object[key]
            if (!(rpc instanceof RPC))
                continue
            this._handler.register(rpc, `${object.id()}.${i++}`)
        }
    }

}