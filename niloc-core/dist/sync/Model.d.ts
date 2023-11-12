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
    emitter(): IEmitter<ModelEvents>;
    /**
     * @deprecated Use `addPlugin` instead
     */
    plugin(plugin: Plugin): void;
    addPlugin(plugin: Plugin): this;
    register<T extends SyncObject>(type: SyncObjectType<T>, typeId?: string): void;
    instantiate<T extends SyncObject>(type: SyncObjectType<T>, id?: string): T;
    send(objectId?: string): void;
    syncTo(address: Address): void;
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
