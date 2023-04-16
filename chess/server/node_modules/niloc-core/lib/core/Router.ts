import { Emitter } from "utils";
import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";

interface RouterEvents {
    message: {
        message: Message,
        channel: number
    }
}

export interface Router {

    id(): string
    send(address: Address, channel: number, data: any): void
    emitter(): Emitter<RouterEvents>

}

export class Router implements Router {

    private readonly _address: Address
    private readonly _emitter: Emitter<RouterEvents>
    private readonly _id: string

    constructor(id: string, public readonly network: Network) {
        this._id = id
        this._address = Address.to(id)
        this._emitter = new Emitter()
        network.emitter().on('message', ({ peerId, channel, message }) => this._onMessage(peerId, channel, message))
    }   

    emitter(): Emitter<RouterEvents> {
        return this._emitter
    }

    send(address: Address, channel: number, data: any): void {
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

    id(): string {
        return this._id
    }

    private _onMessage(peerId: string, channel: number, message: Message) {
        if (Address.match(message.address, this._address))
            this._emitter.emit('message', { message, channel })
        
        for (const peer of this.network.peers()) {
            if (peer.id() === peerId)
                continue

            if (Address.match(message.address, peer.address()))
                peer.send(channel, message)
        }
    }

}