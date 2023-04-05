import { Emitter } from "utils";
import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC, RPCHandler } from "./RPC";

interface ApplicationEvents<T> {
    message: Message<T>
}

interface ChannelEvents {
    message: Message
}

interface Channel extends Emitter<ChannelEvents> {

    id(): number
    post(data: any): void

}

export interface Application<T = any> {
    emitter(): Emitter<ApplicationEvents<T>>
    send(address: Address, data: T): void
    rpc(): RPC
    createChannel(channel: number): Channel
    channel(channel: number): Channel
}


class Channel implements Channel {

    private _id: number

    constructor(id: number) {
        this._id = id
    }

    id(): number { return this._id }
    
    post(data: any): void {
        
    }

}

enum ApplicationChannel {
    Data = 0,
    RPC = 1
}

const RESERVED_CHANNELS = Object.keys(ApplicationChannel).length / 2
export class Application<T = any> implements Application<T> {

    private _rpc: RPCHandler
    private _emitter = new Emitter<ApplicationEvents<T>>()

    private _channels: Record<number, (message: Message) => void> = {}

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

    channel(channel: number): Channel {
        const id = channel + RESERVED_CHANNELS
        if (this._channels[id])
            return this._channels[id]
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

        if (this._channels[channel])
            this._channels[channel](message)
    }
}