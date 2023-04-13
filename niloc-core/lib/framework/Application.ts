import { Emitter } from "utils";
import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC, RPCHandler } from "./RPC";
import { Channel, DataChannel } from "../channel/DataChannel";

interface ApplicationEvents<T> {
    message: Message<T>
}

export interface Application<Data = any> {
    emitter(): Emitter<ApplicationEvents<Data>>
    send(address: Address, data: Data): void
    rpc(): RPC
    channel<T>(channel: number): Channel<T>
}

enum ApplicationChannel {
    Data = 0,
    RPC = 1
}

const RESERVED_CHANNELS = Object.keys(ApplicationChannel).length / 2

const CHANNEL_ID = (channel: number) => channel + RESERVED_CHANNELS

export class Application<Data = any> implements Application<Data> {

    private _rpc: RPCHandler
    private _emitter = new Emitter<ApplicationEvents<Data>>()

    private _channels: Record<number, DataChannel<any>> = {}

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

    emitter(): Emitter<ApplicationEvents<Data>> {
        return this._emitter
    }

    send(address: Address, data: Data): void {
        this.router.send(address, ApplicationChannel.Data, data)
    }

    channel<T>(channel: number): Channel<T> {
        const channelId = CHANNEL_ID(channel)

        if (!this._channels[channelId])
            this._channels[channelId] = this._createChannel<T>(channel)
            
        return this._channels[channelId].input()
    }

    private _createChannel<T>(channel: number): DataChannel<T> {
        const dataChannel = new DataChannel<T>(channel)

        dataChannel.output().setListener((address, data) => {
            this.router.send(address, CHANNEL_ID(channel), data)
        })

        return dataChannel
    }

    private _onMessage(message: Message<Data>, channel: number) {
        if (channel === ApplicationChannel.Data) {
            this._emitter.emit('message', message)
            return
        }

        if (channel === ApplicationChannel.RPC) {
            this._rpc.post(message)
            return
        }

        if (this._channels[channel])
            this._channels[channel].output().post(message)
    }
}