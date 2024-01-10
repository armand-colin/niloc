import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";
import { DataChannel } from "../channel/DataChannel";
import { Channel } from "../channel/Channel";
import { Peer } from "./Peer";
import { Identity } from "./Identity";

export interface RouterOpts<N extends Network = Network> {

    identity: Identity,
    
    network: N,

    /**
     * Whether this router should relay messages upon reception or not
     * @default false
     */
    relay?: boolean

}

class SelfPeer extends Peer {

    constructor(
        identity: Identity, 
        readonly onMessage: (peerId: string, channel: number, message: Message) => void
    ) {
        super(identity)
    }

    send(channel: number, message: Message<any>): void {
        this.onMessage(this.id, channel, message)
    }

}

export class Router<N extends Network = Network> {

    public readonly network: N

    private _relay: boolean
    private _identity: Identity
    private _self: Peer

    private readonly _channels: Record<number, DataChannel<any>> = {}

    constructor(opts: RouterOpts<N>) {
        const network = opts.network

        this._relay = opts.relay ?? false
        this._identity = opts.identity

        this._self = new SelfPeer(
            opts.identity,
            this._onMessage
        )

        network.on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))

        this.network = network
    }

    get id() {
        return this._self.id
    }

    get identity(): Identity {
        return this._identity
    }

    /**
     * Gives a peer representing this router. This could be useful to test if an address matches a router for example.
     * 
     * @example
     * ```ts
     * Address.match(address, router.self())
     * ```
     */
    get self(): Peer { 
        return this._self 
    }

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

    private _onMessage = (peerId: string, channel: number, message: Message) => {
        if (Address.match(peerId, message.address, this._self))
            this._receive(channel, message)

        if (!this._relay)
            return

        for (const peer of this.network.peers()) {
            // Absolutely forbidden to send back a message 
            // to someone who sent it to us
            if (peer.id === peerId)
                continue

            if (Address.match(peerId, message.address, peer))
                peer.send(channel, message)
        }
    }

    private _receive(channel: number, message: Message) {
        if (this._channels[channel])
            this._channels[channel].output().post(message)
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
            originId: this.id,
            address,
            data
        }

        for (const peer of this.network.peers()) {
            if (Address.match(this.id, address, peer)) {
                peer.send(channel, message)
            }
        }

        if (Address.match(this.id, address, this._self))
            this._receive(channel, message)
    }

}