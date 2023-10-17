import { SyncObject } from "./SyncObject";
import { Channel } from "../channel/Channel";
import { Plugin } from "./Plugin";
import { Context } from "../core/Context";
import { IEmitter } from "@niloc/utils";
import { Address } from "../core/Address";
import { SyncObjectType } from "./SyncObjectType";
export interface ModelEvents {
    created: SyncObject;
    deleted: string;
}
export interface Model {
    emitter(): IEmitter<ModelEvents>;
    register<T extends SyncObject>(type: SyncObjectType<T>, typeId?: string): void;
    plugin(plugin: Plugin): void;
    instantiate<T extends SyncObject>(type: SyncObjectType<T>, id?: string): T;
    send(): void;
    syncTo(address: Address): void;
}
type ModelData = {
    type: "change";
    changes: string[];
} | {
    type: "sync";
    changes: string[];
};
interface ModelOpts {
    context: Context;
    channel: Channel<ModelData>;
}
export declare class Model {
    private _channel;
    private _context;
    private _emitter;
    private _objectsEmitter;
    private _typesHandler;
    private _objects;
    private _handle;
    private _changeQueue;
    private _reader;
    private _writer;
    private _plugins;
    constructor(opts: ModelOpts);
    get<T extends SyncObject>(id: string): T | null;
    getAll(): SyncObject[];
    private _create;
    private _makeChangeRequester;
    private _onChangeRequest;
    private _collectGlobalSyncs;
    private _collectSyncs;
    private _collectSyncsForObjects;
    private _collectChanges;
    private _collectChangesForObjects;
    private _delete;
    private _onMessage;
    private _onSync;
    private _onChange;
}
export {};
