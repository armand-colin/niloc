import type { IEmitter } from "@niloc/utils";
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
    /**
     * Returns the list of connected peers to this network
     */
    peers(): Iterable<Peer>;
    /**
     *
     */
    emitter(): IEmitter<NetworkEvents>;
}
