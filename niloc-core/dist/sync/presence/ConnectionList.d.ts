import { Channel } from "../../channel/Channel";
import { IEmitter } from "@niloc/utils";
export type ConnectionListEvents = {
    connected: string;
    disconnected: string;
    sync: void;
};
export declare class ConnectionList {
    static owner(channel: Channel<any>): ConnectionList;
    static client(channel: Channel<any>): ConnectionList;
    private _isOwner;
    private _channel;
    private _users;
    private _emitter;
    private constructor();
    emitter(): IEmitter<ConnectionListEvents>;
    users(): IterableIterator<string>;
    isConnected(userId: string): boolean;
    connected(userId: string): void;
    disconnected(userId: string): void;
    private _connected;
    private _disconnected;
    private _sync;
    private _onMessage;
}
