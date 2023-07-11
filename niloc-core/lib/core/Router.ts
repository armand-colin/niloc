import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";
import { DataChannel } from "../channel/DataChannel";
import { Channel } from "../channel/Channel";
import { Peer } from "./Peer";
import { Context } from "./Context";

export interface RouterOpts {

    id: string,

    /**
     * peerId of this router
     */
    network: Network,

    /**
     * Whether this router is a host or not
     * @default false
     */
    host?: boolean

}

export class Router {

    private _id: string
    private _address: Address
    private _self: Peer

    private _context: Context

    private readonly _channels: Record<number, DataChannel<any>> = {}

    public readonly network: Network

    constructor(opts: RouterOpts) {
        this._id = opts.id
        this._address = opts.host ? Address.host() : Address.to(opts.id)

        this._context = new Context(opts.id, opts.host ?? false)

        this._self = {
            id: () => this._id,
            address: () => this._address,
            send: (channel, message) => {
                this._onMessage(this._id, channel, message)
            }
        }

        this.network = opts.network

        this.network.emitter().on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))
    }

    /**
     * @returns peerId of the router
     */
    id(): string { return this._id }
    
    /**
     * @returns address of the router
     */
    address(): Address { return this._address }

    /**
     * Gives a peer representing this router. This could be useful to test is an address matches a router for example.
     * 
     * @example
     * ```ts
     * Address.match(address, router.self())
     * ```
     */
    self(): Peer { return this._self }

    /**
     * Get a channel by index, creating it if needed. This will then be usefull to send / retrieve data from the network
     * @param channel index of the desired channel
     * @example
     * ```ts
     * // Getting channel 0
     * const channel = router.channel<string>(0)
     * channel.post(Address.to("friend"), "Hello world")
     * ```
     */
    channel<T = any>(channel: number): Channel<T> {
        if (!this._channels[channel])
            this._channels[channel] = this._createChannel<T>(channel)

        return this._channels[channel].input()
    }

    context(): Context {
        return this._context
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