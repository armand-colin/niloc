import { Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils";
import { Socket } from "socket.io-client";
export declare class SocketIONetwork implements Network {
    private _emitter;
    private _serverPeer;
    constructor(socket: Socket);
    emitter(): Emitter<NetworkEvents>;
    peers(): Iterable<Peer>;
}
