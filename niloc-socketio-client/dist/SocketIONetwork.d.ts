import { Address, Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils";
import { Socket } from "socket.io-client";
export declare class SocketIONetwork implements Network {
    private _id;
    private _address;
    private _emitter;
    private _serverPeer;
    constructor(id: string, socket: Socket, host?: boolean);
    id(): string;
    address(): Address;
    emitter(): Emitter<NetworkEvents>;
    peers(): Iterable<Peer>;
}
