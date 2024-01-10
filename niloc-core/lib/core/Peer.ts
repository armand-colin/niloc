import { Address } from "./Address"
import { Identity } from "./Identity"
import { Message } from "./Message"

export abstract class Peer {

    constructor(
        readonly identity: Identity,
        readonly address: Address = Address.fromIdentity(identity)
    ) { }

    get id() {
        return this.identity.userId
    }

    get host() {
        return this.identity.host
    }

    /**
     * Send a message to this peer with the given channel
     * @param channel Channel index
     * @param message Message to send, filled in with the correct address and originId
     */
    abstract send(channel: number, message: Message): void

}