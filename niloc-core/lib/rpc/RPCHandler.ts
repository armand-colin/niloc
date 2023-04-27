import { Emitter } from "utils"
import { nanoid } from "nanoid"
import { Message } from "../core/Message"
import { RPC, RPCCallHandler } from "./RPC"
import { Channel } from "../channel/DataChannel"
import { Address } from "../main"

enum RPCMessageType {
    Request = 0,
    Response = 1,
    Error = 2
}

type RPCRequestMessage = {
    type: RPCMessageType.Request,
    id: string,
    name: string,
    args: any[]
}

type RPCResponseMessage = {
    type: RPCMessageType.Response,
    id: string,
    result: any
}

type RPCErrorMessage = {
    type: RPCMessageType.Error,
    id: string,
    reason: any
}

type RPCMessage = RPCRequestMessage | RPCResponseMessage | RPCErrorMessage

namespace RPCMessage {
    export function request(id: string, name: string, args: any[]): RPCMessage {
        return { type: RPCMessageType.Request, id, name, args }
    }

    export function response(id: string, result: any): RPCMessage {
        return { type: RPCMessageType.Response, id, result }
    }

    export function error(id: string, reason?: any): RPCMessage {
        return { type: RPCMessageType.Error, id, reason }
    }
}

export class RPCHandler {

    private _id: string
    private _channel: Channel<RPCMessage>
    private _rpcs: Record<string, RPC<any, any>> = {}

    private _resultEmitter = new Emitter<{ [key: string]: { type: RPCMessageType, data?: any } }>()

    constructor(id: string, channel: Channel<RPCMessage>) {
        this._id = id
        this._channel = channel

        this._channel.addListener(this._onMessage)
    }

    register(rpc: RPC<any, any>, id: string) {
        if (this._rpcs[id]) {
            console.error('Trying to register rpc twice:', id)
            return
        }

        this._rpcs[id] = rpc

        RPC.setCallHandler(rpc, this._makeCallHandler(rpc, id))
    }

    private _makeCallHandler(rpc: RPC<any, any>, rpcId: string): RPCCallHandler {
        const handler: RPCCallHandler = {
            call: (owner, args) => {
                if (owner === this._id)
                    return RPC.call(rpc, args)

                const callId = nanoid()
                const message = RPCMessage.request(callId, rpcId, args)

                return new Promise((resolve, reject) => {
                    let timeout: any | null = setTimeout(() => {
                        timeout = null
                        this._resultEmitter.emit(callId, { type: RPCMessageType.Error, data: "Timed out" })
                    }, 20_000)

                    this._resultEmitter.once(callId, ({ type, data }) => {
                        if (timeout)
                            clearTimeout(timeout)

                        if (type === RPCMessageType.Error)
                            reject(data)
                        else if (type === RPCMessageType.Response)
                            resolve(data)
                    })

                    this._channel.post(Address.to(owner), message)
                })
            }
        }

        return handler
    }

    private _onMessage = (message: Message<RPCMessage>) => {
        const rpcMessage = message.data as RPCMessage
        const originId = message.originId

        switch (rpcMessage.type) {
            case RPCMessageType.Request: {
                this._onRequest(rpcMessage, originId)
                break
            }
            case RPCMessageType.Response: {
                this._onResponse(rpcMessage)
                break
            }
            case RPCMessageType.Error: {
                this._onError(rpcMessage)
                break
            }
            default: {
                break
            }
        }
    }

    private _onRequest(message: RPCRequestMessage, originId: string) {
        const { id, name, args } = message
        const rpc = this._rpcs[name]
        if (!rpc) {
            console.error(`Received unhandled RPC request '${name}', originated from ${originId}`)
            const error = RPCMessage.error(id, `Unhandled RPC by the receiver ${name}`)
            this._channel.post(Address.to(originId), error)
            return
        }

        RPC.call(rpc, args)
            .then(data => {
                const response = RPCMessage.response(id, data)
                this._channel.post(Address.to(originId), response)
            })
            .catch((handleError) => {
                console.error(`Error while handling RPC '${name}':`, handleError)
                const error = RPCMessage.error(id, "Receiver got an error while responding")
                this._channel.post(Address.to(originId), error)
            })
    }

    private _onResponse(message: RPCResponseMessage) {
        const { id, result } = message
        this._resultEmitter.emit(id, { type: RPCMessageType.Response, data: result })
    }

    private _onError(message: RPCErrorMessage) {
        const { id, reason } = message
        this._resultEmitter.emit(id, { type: RPCMessageType.Error, data: reason })
    }

}