import { Address, Emitter, Message, Peer } from "niloc-core";
import { Socket } from "./Socket";
interface PeerEvents {
    message: {
        channel: number;
        message: Message;
    };
}
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
export {};
