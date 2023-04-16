import { Emitter } from "utils"
import { nanoid } from "nanoid"
import { Message } from "../core/Message"

type HandleCallback = (e: { data?: any, originId: string }) => any

interface RPCHandlerEvents {
    message: { targetId: string, message: RPCMessage }
}

export interface RPC {

    handle(identifier: string, callback: HandleCallback): void
    request(identifier: string, targetId: string, data?: any): Promise<any>

}

export interface RPCHandler extends RPC {

    emitter(): Emitter<RPCHandlerEvents>
    post(message: Message): void

}

enum RPCMessageType {
    Request = 0,
    Response = 1,
    Error = 2
}

type RPCRequestMessage = {
    type: RPCMessageType.Request,
    id: string,
    name: string,
    data?: any
}

type RPCResponseMessage = {
    type: RPCMessageType.Response,
    id: string,
    data?: any
}

type RPCErrorMessage = {
    type: RPCMessageType.Error,
    id: string,
    reason?: any
}

type RPCMessage = RPCRequestMessage | RPCResponseMessage | RPCErrorMessage

function wrapExec(callback: () => any): Promise<any> {
    try {
        const result = callback()
        return Promise.resolve(result)
    } catch (e) {
        return Promise.reject(e)
    }
}

namespace RPCMessage {
    export function request(id: string, name: string, data?: any): RPCMessage {
        return { type: RPCMessageType.Request, id, name, data }
    }

    export function response(id: string, data?: any): RPCMessage {
        return { type: RPCMessageType.Response, id, data }
    }

    export function error(id: string, reason?: any): RPCMessage {
        return { type: RPCMessageType.Error, id, reason }
    }
}

export class RPCHandler implements RPCHandler {

    private _emitter = new Emitter<RPCHandlerEvents>()
    private _handlers: Record<string, HandleCallback> = {}

    private _resultEmitter = new Emitter<{ [key: string]: { type: RPCMessageType, data?: any } }>()

    constructor() { }

    emitter(): Emitter<RPCHandlerEvents> {
        return this._emitter
    }

    handle(name: string, callback: HandleCallback): void {
        if (this._handlers[name]) {
            console.error(`Cannot handle the same RPC multiple times (${name})`)
            return
        }
        this._handlers[name] = callback
    }

    request(name: string, targetId: string, data?: any): Promise<any> {
        const id = nanoid()
        const message = RPCMessage.request(id, name, data)

        return new Promise((resolve, reject) => {
            let timeout: any | null = setTimeout(() => {
                timeout = null
                this._resultEmitter.emit(id, { type: RPCMessageType.Error, data: "Timed out" })
            }, 20_000)

            this._resultEmitter.once(id, ({ type, data }) => {
                if (timeout)
                    clearTimeout(timeout)

                if (type === RPCMessageType.Error)
                    reject(data)
                else if (type === RPCMessageType.Response)
                    resolve(data)  
            })
            this._emitter.emit('message', { targetId, message })
        })
    }

    post(message: Message): void {
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
        const { id, name, data } = message
        const handler = this._handlers[name]
        if (!handler) {
            console.error(`Received unhandled RPC request '${name}', originated from ${originId}`)
            const error = RPCMessage.error(id, `Unhandled RPC by the receiver ${name}`)
            this._emitter.emit('message', { targetId: originId, message: error })
            return
        }

        wrapExec(() => handler({ data, originId }))
            .then(data => {
                const response = RPCMessage.response(id, data)
                this._emitter.emit('message', { targetId: originId, message: response })
            })
            .catch((handleError) => {
                console.error(`Error while handling RPC '${name}':`, handleError)
                const error = RPCMessage.error(id, "Receiver got an error while responding")
                this._emitter.emit('message', { targetId: originId, message: error })
            })
    }

    private _onResponse(message: RPCResponseMessage) {
        const { id, data } = message
        this._resultEmitter.emit(id, { type: RPCMessageType.Response, data })
    }

    private _onError(message: RPCErrorMessage) {
        const { id, reason } = message
        this._resultEmitter.emit(id, { type: RPCMessageType.Error, data: reason })
    }

}