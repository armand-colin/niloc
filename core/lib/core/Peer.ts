import { Emitter } from "@niloc/utils";
import { Identity } from "./Identity";
import { Message } from "./Message";
import { Address } from "./Address";

export type PeerEvents = {
    message: {
        channel: number,
        message: Message
    },
    destroy: Peer
}

export abstract class Peer extends Emitter<PeerEvents> {

    private _closed = false

    constructor(
        readonly identity: Identity
    ) {
        super()
    }

    get closed() {
        return this._closed
    }

    match(address: Address, senderId: string): boolean {
        return Address.match(senderId, address, this.identity)
    }

    destroy() {
        if (this._closed)
            return

        this._closed = true
        this.emit('destroy', this)
        this.removeAllListeners()
    }

    abstract send(channel: number, message: Message): void

}