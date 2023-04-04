import { Emitter } from "utils";
import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC, RPCHandler } from "./RPC";

interface ApplicationEvents<T> {
    message: Message<T>
}

export interface Application<T = any> {
    emitter(): Emitter<ApplicationEvents<T>>
    send(address: Address, data: T): void
    rpc(): RPC
}

enum ApplicationChannel {
    Data = 0,
    RPC = 1
}

export class Application<T = any> implements Application<T> {

    private _rpc: RPCHandler
    private _emitter = new Emitter<ApplicationEvents<T>>()

    public readonly router: Router

    constructor(
        public readonly id: string, 
        public readonly network: Network
    ) {
        this.router = new Router(id, network)
        this.router.emitter().on('message', ({ message, channel }) => this._onMessage(message, channel))
        
        this._rpc = new RPCHandler()
        this._rpc.emitter().on('message', ({ targetId, message }) => {
            this.router.send(Address.to(targetId), ApplicationChannel.RPC, message)
        })
    }

    rpc(): RPC {
        return this._rpc
    }

    emitter(): Emitter<ApplicationEvents<T>> {
        return this._emitter
    }

    send(address: Address, data: T): void {
        this.router.send(address, ApplicationChannel.Data, data)
    }

    private _onMessage(message: Message<T>, channel: number) {
        if (channel === ApplicationChannel.Data) {
            this._emitter.emit('message', message)
            return
        }

        if (channel === ApplicationChannel.RPC) {
            this._rpc.post(message)
            return
        }
    }
}