import { Address, Message, Peer, PeerEvents } from "niloc-core";
import { Socket } from "socket.io";
import { Emitter } from "utils";
interface SocketIOPeerEvents {
    disconnect: void;
}
export declare class SocketIOPeer implements Peer {
    private _id;
    private _address;
    private _emitter;
    private _socketIOEmitter;
    private _socket;
    constructor(socket: Socket, id: string, host: boolean);
    id(): string;
    address(): Address;
    emitter(): Emitter<PeerEvents>;
    socketIOEmitter(): Emitter<SocketIOPeerEvents>;
    send(channel: number, message: Message): void;
    destroy(): void;
    private _onMessage;
}
export {};
