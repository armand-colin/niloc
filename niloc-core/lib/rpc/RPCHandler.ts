import { Message } from "../core/Message"
import { RPC, RPCCallHandler } from "./RPC"
import { Channel } from "../channel/Channel"
import { Address } from "../core/Address"
import { Peer } from "../core/Peer"

type RPCMessage = {
    id: string,
    args: any[]
}

namespace RPCMessage {
    export function make(id: string, args: any[]): RPCMessage {
        return { id, args }
    }
}

export interface RPCHandler {

    register(rpc: RPC<any>, id: string): void
    infuse(object: any, id: string): void

}

export class RPCHandler implements RPCHandler {

    private _self: Peer
    private _channel: Channel<RPCMessage>
    private _rpcs: Record<string, RPC<any>> = {}

    constructor(self: Peer, channel: Channel<RPCMessage>) {
        this._self = self
        this._channel = channel

        this._channel.addListener(this._onMessage)
    }

    register(rpc: RPC<any>, id: string) {
        if (this._rpcs[id]) {
            console.error('Trying to register rpc twice:', id)
            return
        }

        this._rpcs[id] = rpc

        RPC.setCallHandler(rpc, this._makeCallHandler(id))
    }

    infuse(object: any, id: string) {
        for (const key in object) {
            if (object[key] instanceof RPC)
                this.register(object[key], `${id}.${key}`)
        }
    }

    private _makeCallHandler(rpcId: string): RPCCallHandler {
        const handler: RPCCallHandler = {
            call: (address, args) => {
                const message = RPCMessage.make(rpcId, args)
                this._channel.post(address, message)
            }
        }

        return handler
    }

    private _onMessage = (message: Message<RPCMessage>) => {
        const rpcMessage = message.data as RPCMessage
        const originId = message.originId

        if (!Address.match(message.originId, message.address, this._self))
            return

        this._onRequest(rpcMessage, originId)
    }

    private _onRequest(message: RPCMessage, originId: string) {
        const { id, args } = message
        const rpc = this._rpcs[id]

        if (!rpc) {
            console.error(`Received unhandled RPC request '${id}', originated from ${originId}`)
            return
        }

        RPC.call(rpc, args)
    }

}