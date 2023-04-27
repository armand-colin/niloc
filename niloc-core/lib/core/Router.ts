import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";
import { Channel, DataChannel } from "../channel/DataChannel";

export interface Router {

    id(): string
    channel<T>(channel: number): Channel<T>

}

export class Router implements Router {

    private readonly _id: string
    private readonly _address: Address
    private readonly _channels: Record<number, DataChannel<any>> = {}

    constructor(id: string, public readonly network: Network) {
        this._id = id
        this._address = Address.to(id)
        network.emitter().on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))
    }

    id(): string {
        return this._id
    }

    channel<T>(channel: number): Channel<T> {
        if (!this._channels[channel])
            this._channels[channel] = this._createChannel<T>(channel)

        return this._channels[channel].input()
    }

    private _onMessage(peerId: string, channel: number, message: Message) {
        if (Address.match(message.address, this._address)) {
            if (this._channels[channel])
                this._channels[channel].output().post(message)
        }

        for (const peer of this.network.peers()) {
            if (peer.id() === peerId)
                continue

            if (Address.match(message.address, peer.address()))
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
            originId: this._id,
            address,
            data
        }

        for (const peer of this.network.peers()) {
            if (Address.match(address, peer.address())) {
                peer.send(channel, message)
            }
        }
    }

}