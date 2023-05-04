import { Template } from "./Template";
import { SyncObject } from "./SyncObject";
import { Channel } from "../channel/DataChannel";
import { Address, Emitter } from "../main";
import { Plugin } from "./Plugin";
export interface ModelEvents {
    created: SyncObject;
}
export interface Model {
    emitter(): Emitter<ModelEvents>;
    register(template: Template<SyncObject>): void;
    plugin(plugin: Plugin): void;
    instantiate<T extends SyncObject>(template: Template<T>, id?: string): T;
    tick(): void;
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
    channel: Channel<ModelData>;
}
export declare class Model {
    private _channel;
    private _emitter;
    private _objectsEmitter;
    private _templates;
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
    private _connectSyncsForObjects;
    private _collectChanges;
    private _onMessage;
    private _onSync;
    private _onChange;
}
export {};
