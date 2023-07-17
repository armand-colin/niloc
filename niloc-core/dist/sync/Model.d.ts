import { Template } from "./Template";
import { SyncObject } from "./SyncObject";
import { Channel } from "../channel/Channel";
import { Plugin } from "./Plugin";
import { Context } from "../core/Context";
import type { Emitter } from "@niloc/utils";
import { Address } from "../core/Address";
export interface ModelEvents {
    created: SyncObject;
}
export interface Model {
    emitter(): Emitter<ModelEvents>;
    register<T extends SyncObject>(template: Template<T>): void;
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
    context: Context;
    channel: Channel<ModelData>;
}
export declare class Model {
    private _channel;
    private _context;
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
    private _collectSyncsForObjects;
    private _collectChanges;
    private _onMessage;
    private _onSync;
    private _onChange;
}
export {};
