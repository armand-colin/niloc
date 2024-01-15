import { Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";
export declare class SocketIOPeer extends Peer {
    private _socket;
    constructor(identity: Identity, socket: Socket);
    send(channel: number, message: Message<any>): void;
    match(): boolean;
    private _onMessage;
}
