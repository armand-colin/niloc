import { Network, Peer } from "@niloc/core";
import { Socket } from "./Socket";
export declare class SocketIONetwork extends Network {
    private _serverPeer;
    constructor(socket: Socket);
    peers(): Iterable<Peer>;
}
