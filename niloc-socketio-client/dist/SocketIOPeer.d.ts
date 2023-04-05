import { Emitter } from "utils";
import { Address, Message, Peer, PeerEvents } from "niloc-core";
import { Socket } from "socket.io-client";
export declare class SocketIOPeer implements Peer {
    private _id;
    private _address;
    private _emitter;
    private _socket;
    constructor(id: string, socket: Socket);
    id(): string;
    address(): Address;
    emitter(): Emitter<PeerEvents>;
    send(channel: number, message: Message): void;
    private _onMessage;
}
