import { Address, Network, NetworkEvents, Peer } from "niloc-core";
import { Socket } from "socket.io";
import { Emitter } from "utils";
export declare class SocketIONetwork implements Network {
    private _address;
    private _peers;
    private _emitter;
    constructor(host: boolean);
    id(): string;
    address(): Address;
    peers(): Iterable<Peer>;
    emitter(): Emitter<NetworkEvents>;
    addSocket(socket: Socket, peerId: string, host: boolean): void;
}
