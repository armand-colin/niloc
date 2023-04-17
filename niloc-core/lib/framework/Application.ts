import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC, RPCHandler } from "./RPC";
import { Channel, DataChannel } from "../channel/DataChannel";


export interface Application<Data = any> {
    send(address: Address, data: Data): void
    rpc(): RPC
    channel<T>(channel: number): Channel<T>
}

export class Application<Data = any> implements Application<Data> {

    private _rpc: RPCHandler

    private _channels: Record<number, DataChannel<any>> = {}

    public readonly router: Router

    constructor(
        public readonly id: string,
        public readonly network: Network
    ) {
        this.router = new Router(id, network)
        this.router.emitter().on('message', ({ message, channel }) => this._onMessage(message, channel))

        // TODO: rebuild
        this._rpc = new RPCHandler()
        // this._rpc.emitter().on('message', ({ targetId, message }) => {
        //     this.router.send(Address.to(targetId), ApplicationChannel.RPC, message)
        // })
    }

    rpc(): RPC {
        return this._rpc
    }

    channel<T>(channel: number): Channel<T> {
        if (!this._channels[channel])
            this._channels[channel] = this._createChannel<T>(channel)
            
        return this._channels[channel].input()
    }

    private _createChannel<T>(channel: number): DataChannel<T> {
        const dataChannel = new DataChannel<T>(channel)

        dataChannel.output().setListener((address, data) => {
            this.router.send(address, channel, data)
        })

        return dataChannel
    }

    private _onMessage(message: Message<Data>, channel: number) {
        if (this._channels[channel])
            this._channels[channel].output().post(message)
    }
}