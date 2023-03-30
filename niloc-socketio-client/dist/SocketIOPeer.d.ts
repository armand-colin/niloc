import { Address, Message, Peer } from "niloc-core";
import { Socket } from "socket.io-client";
export declare class SocketIOPeer implements Peer {
    private _id;
    private _socket;
    private _address;
    constructor(id: string, socket: Socket);
    id(): string;
    address(): Address;
    send(channel: number, message: Message): void;
}
