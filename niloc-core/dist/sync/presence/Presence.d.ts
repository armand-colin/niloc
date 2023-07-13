import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { SyncObject } from "../SyncObject";
import { Factory } from "../Template";
import { Emitter } from "@niloc/utils";
export type PresenceEvents<T extends SyncObject> = {
    usersChanged: T[];
};
export declare class Presence<T extends SyncObject> {
    private _model;
    private _channel;
    private _user;
    private _users;
    private _connected;
    private _emitter;
    constructor(context: Context, channel: Channel<any>, factory: Factory<T>);
    user(): T;
    users(): T[];
    emitter(): Emitter<PresenceEvents<T>>;
    /**
     * Has to be called whenever the user is updated
     */
    tick(): void;
    connected(): void;
    private _onPresenceMessage;
    private _onUserCreated;
    private _updateUser;
}
