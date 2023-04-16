import { Network, NetworkEvents, Peer } from "niloc-core";
import { Socket } from "socket.io";
import { Emitter } from "utils";
export declare class SocketIONetwork implements Network {
    private _peers;
    private _emitter;
    constructor();
    addSocket(socket: Socket): void;
    id(): string;
    peers(): Iterable<Peer>;
    emitter(): Emitter<NetworkEvents>;
}
