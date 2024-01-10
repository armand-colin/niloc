import { Emitter, Identity, Network, NetworkEvents, Peer } from "@niloc/core";
import { Socket } from "./Socket";
type SocketIONetworkOpts = {
    /**
     * @default false
     */
    host?: boolean;
};
export declare class SocketIONetwork extends Emitter<NetworkEvents> implements Network {
    private _peers;
    private _identity;
    constructor(opts?: SocketIONetworkOpts);
    identity(): Identity;
    peers(): Iterable<Peer>;
    addSocket(socket: Socket, peerId: string, host: boolean): void;
}
export {};
