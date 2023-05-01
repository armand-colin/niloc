import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";
import { Channel, DataChannel } from "../channel/DataChannel";
import { Peer, PeerEvents } from "./Peer";
import { Emitter } from "utils";

export interface Router {

    id(): string
    address(): Address
    self(): Peer
    channel<T>(channel: number): Channel<T>

}

export interface RouterOpts {
    network: Network,
    id: string,
    host?: boolean
}

export class Router implements Router {

    private _id: string
    private _address: Address
    private _self: Peer

    private readonly _channels: Record<number, DataChannel<any>> = {}

    public readonly network: Network

    constructor(opts: RouterOpts) {
        this._id = opts.id
        this._address = opts.host ? Address.host() : Address.to(opts.id)

        const emitter = new Emitter<PeerEvents>()
        this._self = {
            id: () => this._id,
            address: () => this._address,
            emitter: () => emitter,
            send: (channel, message) => {
                this._onMessage(this._id, channel, message)
            }
        }

        this.network = opts.network

        this.network.emitter().on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))
    }

    id(): string { return this._id }
    address(): Address { return this._address }
    self(): Peer { return this._self }

    channel<T>(channel: number): Channel<T> {
        if (!this._channels[channel])
            this._channels[channel] = this._createChannel<T>(channel)

        return this._channels[channel].input()
    }

    private _onMessage(peerId: string, channel: number, message: Message) {
        if (Address.match(message.address, this._self)) {
            if (this._channels[channel])
                this._channels[channel].output().post(message)
        }

        for (const peer of this.network.peers()) {
            if (peer.id() === peerId)
                continue

            if (Address.match(message.address, peer))
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
            if (Address.match(address, peer)) {
                peer.send(channel, message)
            }
        }
    }

}