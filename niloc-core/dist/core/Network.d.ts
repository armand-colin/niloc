import { Emitter } from "utils";
import { Message } from "./Message";
import { Peer } from "./Peer";
export interface NetworkEvents {
    message: {
        peerId: string;
        channel: number;
        message: Message;
    };
}
export interface Network {
    peers(): Iterable<Peer>;
    emitter(): Emitter<NetworkEvents>;
}
