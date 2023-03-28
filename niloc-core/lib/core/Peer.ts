import { Emitter } from "utils"
import { Address } from "./Address"
import { Message } from "./Message"

export interface PeerEvents {
    message: {
        channel: number,
        message: Message
    }
}

export interface Peer {

    id(): string
    address(): Address
    emitter(): Emitter<PeerEvents>
    send(channel: number, message: Message): void

}