import { Address } from "./Address";
import { Message } from "./Message";
import { DataChannel } from "../channel/DataChannel";
import { Channel, ChannelMessage } from "../channel/Channel";
import { Identity } from "./Identity";
import { Network } from "./Network";

export interface RouterOpts<N extends Network = Network> {

    identity: Identity,
    network: N,

}


export class Router<N extends Network = Network> {

    public readonly network: N

    private _identity: Identity

    private readonly _channels: Record<number, DataChannel<any>> = {}

    constructor(opts: RouterOpts<N>) {
        const network = opts.network

        this._identity = opts.identity

        network.onMessage(this._onMessage)

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

    private _onMessage = (channel: number, message: Message) => {
        if (message.originId === this.identity.userId) {
            // XXX: we may want tot handle this gracefully
            console.warn('Received a message that was produced by this user. This may indicate an infinite loop in your network setup.')
            return
        }

        const address = message.address

        if (Address.match(message.originId, address, this._identity)) {
            this._receive(channel, message)
        }

        this.network.send(channel, message)
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

    private _send(channelMessage: ChannelMessage, channel: number): void {
        const message = new Message({
            originId: channelMessage.originId ?? this._identity.userId,
            address: channelMessage.address ?? Address.broadcast(),
            data: channelMessage.data
        })

        if (Address.match(message.originId, message.address, this._identity))
            this._receive(channel, message)

        this.network.send(channel, message)
    }

}