import { Emitter, Network, NetworkEvents, Peer } from "@niloc/core";
import { Socket } from "./Socket";
export declare class SocketIONetwork implements Network {
    private _peers;
    private _emitter;
    peers(): Iterable<Peer>;
    emitter(): Emitter<NetworkEvents>;
    addSocket(socket: Socket, peerId: string, host: boolean): void;
}
