import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { Model } from "../Model";
import { SyncObject } from "../SyncObject";
import { IEmitter } from "@niloc/utils";
import { ConnectionList } from "./ConnectionList";
import { SyncObjectType } from "../SyncObjectType";
export type PresenceEvents<T extends SyncObject> = {
    changed: T[];
    connected: T;
    disconnected: string;
};
type Options<T extends SyncObject> = {
    context: Context;
    channel: Channel<any>;
    type: SyncObjectType<T>;
    connectionList: ConnectionList;
};
export declare class Presence<T extends SyncObject> {
    private _connectionList;
    private _model;
    private _emitter;
    private _user;
    private _others;
    constructor(options: Options<T>);
    user(): T;
    users(): T[];
    others(): T[];
    emitter(): IEmitter<PresenceEvents<T>>;
    model(): Model;
    send(): void;
    register(callback: () => void): () => void;
    private _onUserCreated;
    private _onConnected;
    private _onDisconnected;
}
export {};
