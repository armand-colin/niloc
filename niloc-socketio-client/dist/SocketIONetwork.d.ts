import { Network } from "niloc-core";
import { Socket } from "socket.io-client";
export declare class SocketIONetwork implements Network {
    private _id;
    private _emitter;
    private _io;
    constructor(id: string, io: Socket);
}
