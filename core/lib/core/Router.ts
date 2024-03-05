import { Address } from "./Address";
import { Message } from "./Message";
import { INetwork } from "./Network.interface";
import { DataChannel } from "../channel/DataChannel";
import { Channel } from "../channel/Channel";
import { Identity } from "./Identity";

export interface RouterOpts<N extends INetwork = INetwork> {

    identity: Identity,
    
    network: N,

}


export class Router<N extends INetwork = INetwork> {

    public readonly network: INetwork

    private _identity: Identity

    private readonly _channels: Record<number, DataChannel<any>> = {}

    constructor(opts: RouterOpts<N>) {
        const network = opts.network

        this._identity = opts.identity

        network.on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))

        this.network = network
    }

    get identity(): Identity {
        return this._identity
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
        if (Address.match(peerId, message.address, this._identity))
            this._receive(channel, message)

        this.network.send(channel, message, peerId)
    }

    private _receive(channel: number, message: Message) {
        if (this._channels[channel])
            this._channels[channel].output().post(message)
    }

    private _createChannel<T>(channel: number): DataChannel<T> {
        const dataChannel = new DataChannel<T>(channel)

        dataChannel.output().setListener((message) => {
            this._send(message, channel)
        })

        return dataChannel
    }

    private _send(message: Message, channel: number): void {
        if (Address.match(this.identity.userId, message.address, this._identity))
            this._receive(channel, message)

        this.network.send(channel, message, this.identity.userId)
    }

}