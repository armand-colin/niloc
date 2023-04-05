import { Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils";
import { Socket } from "socket.io-client";
export declare class SocketIONetwork implements Network {
    private _id;
    private _emitter;
    private _peer;
    constructor(id: string, socket: Socket);
    id(): string;
    emitter(): Emitter<NetworkEvents>;
    peers(): Iterable<Peer>;
}
