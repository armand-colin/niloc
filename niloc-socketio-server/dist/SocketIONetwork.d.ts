import { Network, Peer } from "@niloc/core";
import { Socket } from "./Socket";
export declare class SocketIONetwork extends Network {
    private _peers;
    peers(): Iterable<Peer>;
    addSocket(socket: Socket, peerId: string, host: boolean): void;
}
