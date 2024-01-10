import { Emitter, Identity, Network, NetworkEvents, Peer } from "@niloc/core";
import { Socket } from "./Socket";
export declare class SocketIONetwork extends Emitter<NetworkEvents> implements Network {
    private _serverPeer;
    private _identity;
    constructor(identity: Identity, socket: Socket);
    identity(): Identity;
    peers(): Iterable<Peer>;
}
