import { Channel } from "../channel/DataChannel";
import { SyncObject } from "../main";
import { Plugin } from "../sync/Plugin";
import { RPC } from "./RPC";
import { RPCHandler } from "./RPCHandler";

export class RPCPlugin implements Plugin {
    
    private _handler: RPCHandler

    constructor(id: string, channel: Channel<any>) {
        this._handler = new RPCHandler(id, channel)
    }

    beforeCreate<T extends SyncObject>(object: T): void {
        let i = 0
        for (const key in object) {
            const rpc = object[key]
            if (!(rpc instanceof RPC<any, any>))
                continue
            this._handler.register(rpc, `${object.id()}.${i++}`)
        }
    }

}