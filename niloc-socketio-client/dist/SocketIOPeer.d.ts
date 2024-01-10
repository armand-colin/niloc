import { Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";
type PeerMessage = {
    channel: number;
    message: Message;
};
export declare class SocketIOPeer extends Peer {
    private _emitter;
    private _socket;
    constructor(identity: Identity, socket: Socket);
    send(channel: number, message: Message): void;
    addListener(callback: (message: PeerMessage) => void): void;
    removeListener(callback: (message: PeerMessage) => void): void;
    private _onMessage;
}
export {};
