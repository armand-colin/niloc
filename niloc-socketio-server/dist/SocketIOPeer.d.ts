import { Emitter, Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";
interface SocketIOPeerEvents {
    disconnect: void;
}
type PeerMessage = {
    channel: number;
    message: Message;
};
export declare class SocketIOPeer extends Peer {
    private _emitter;
    private _socketIOEmitter;
    private _socket;
    constructor(identity: Identity, socket: Socket);
    get socketIOEmitter(): Emitter<SocketIOPeerEvents>;
    send(channel: number, message: Message): void;
    addListener(callback: (message: PeerMessage) => void): void;
    removeListener(callback: (message: PeerMessage) => void): void;
    destroy(): void;
    private _onMessage;
}
export {};
