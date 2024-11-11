import { Message } from "../core/Message"
import { RPC, RPCCallHandler } from "./RPC"
import { Channel } from "../channel/Channel"
import { Address } from "../core/Address"
import { BinaryReader, BinaryWriter, Identity } from "../main"
import { Serializable } from "../serialize/Serializable"
import { staticImplements } from "../tools/staticImplements"
import { Deserializer } from "../serialize/Deserializer"

@staticImplements<Deserializer<RPCMessage>>()
class RPCMessage implements Serializable {

    constructor(
        public readonly id: string,
        public readonly args: any[]
    ) { }

    static deserialize(reader: BinaryReader): RPCMessage {
        const id = reader.readString()
        const args = new Array(reader.readU())

        for (let i = 0; i < args.length; i++)
            args[i] = reader.readJSON()

        return new RPCMessage(id, args)
    }

    serialize(writer: BinaryWriter) {
        writer.writeString(this.id)
        writer.writeU(this.args.length)

        for (const arg of this.args)
            writer.writeJSON(arg)
    }

}

export interface RPCHandler {

    register(rpc: RPC<any>, id: string): void
    infuse(object: any, id: string): void

}

export class RPCHandler implements RPCHandler {

    private _identity: Identity
    private _channel: Channel<RPCMessage>
    private _rpcs: Record<string, RPC<any>> = {}

    constructor(identity: Identity, channel: Channel<RPCMessage>) {
        this._identity = identity
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
                const rpcMessage = new RPCMessage(rpcId, args)

                this._channel.post({
                    data: rpcMessage,
                    address,
                })
            }
        }

        return handler
    }

    private _onMessage = (message: Message<RPCMessage>) => {
        const rpcMessage = message.deserialize(RPCMessage)
        const originId = message.originId

        if (!Address.match(message.originId, message.address, this._identity))
            return

        this._onRequest(rpcMessage, originId)
    }

    private _onRequest(message: RPCMessage, originId: string) {
        const id = message.id
        const rpc = this._rpcs[id]

        if (!rpc) {
            console.error(`Received unhandled RPC request '${id}', originated from ${originId}`)
            return
        }

        RPC.call(rpc, message.args)
    }

}