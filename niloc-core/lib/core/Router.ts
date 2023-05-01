import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";
import { Channel, DataChannel } from "../channel/DataChannel";

export interface Router {

    channel<T>(channel: number): Channel<T>

}

export class Router implements Router {

    private readonly _channels: Record<number, DataChannel<any>> = {}

    constructor(public readonly network: Network) {
        network.emitter().on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))
    }

    channel<T>(channel: number): Channel<T> {
        if (!this._channels[channel])
            this._channels[channel] = this._createChannel<T>(channel)

        return this._channels[channel].input()
    }

    private _onMessage(peerId: string, channel: number, message: Message) {
        if (Address.match(message.address, this.network.id(), this.network.address())) {
            if (this._channels[channel])
                this._channels[channel].output().post(message)
        }

        for (const peer of this.network.peers()) {
            if (peer.id() === peerId)
                continue

            if (Address.match(message.address, peer.id(), peer.address()))
                peer.send(channel, message)
        }
    }

    private _createChannel<T>(channel: number): DataChannel<T> {
        const dataChannel = new DataChannel<T>(channel)

        dataChannel.output().setListener((address, data) => {
            this._send(address, channel, data)
        })

        return dataChannel
    }

    private _send(address: Address, channel: number, data: any): void {
        const message: Message = {
            originId: this.network.id(),
            address,
            data
        }

        for (const peer of this.network.peers()) {
            if (Address.match(address, peer.id(), peer.address())) {
                peer.send(channel, message)
            }
        }
    }

}