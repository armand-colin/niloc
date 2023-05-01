import { Emitter } from "utils";
import { Message } from "./Message";
import { Peer } from "./Peer";
import { Address } from "./Address";

export interface NetworkEvents {
    message: {
        peerId: string,
        channel: number, 
        message: Message
    }
}

export interface Network {

    id(): string
    address(): Address
    peers(): Iterable<Peer>
    emitter(): Emitter<NetworkEvents>

}