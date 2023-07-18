import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { SyncObject } from "../SyncObject";
import { Factory } from "../Template";
import { Emitter } from "@niloc/utils";
import { ConnectionList } from "./ConnectionList";
export type PresenceEvents<T extends SyncObject> = {
    usersChanged: T[];
};
type Options<T extends SyncObject> = {
    context: Context;
    channel: Channel<any>;
    factory: Factory<T>;
    connectionList: ConnectionList;
};
export declare class Presence<T extends SyncObject> {
    private _connectionList;
    private _model;
    private _emitter;
    private _user;
    private _users;
    constructor(options: Options<T>);
    user(): T;
    users(): T[];
    emitter(): Emitter<PresenceEvents<T>>;
    tick(): void;
    private _onUserCreated;
    private _onConnected;
    private _onDisconnected;
}
export {};
