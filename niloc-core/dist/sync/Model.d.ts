import { Template } from "./Template";
import { SyncObject } from "./SyncObject";
import { Channel } from "../channel/DataChannel";
import { ModelReader, ModelWriter } from "./Synchronize";
import { Emitter } from "utils";
interface ModelEvents {
    created: SyncObject;
}
export interface Model {
    emitter(): Emitter<ModelEvents>;
    register(template: Template<SyncObject>): void;
    instantiate<T extends SyncObject>(template: Template<T>): T;
    tick(): void;
}
type ModelData = {
    type: "write";
    changes: string[];
};
interface ModelOpts {
    channel: Channel<ModelData>;
    reader: ModelReader;
    writer: ModelWriter;
}
export declare class Model {
    private _channel;
    private _emitter;
    private _templates;
    private _objects;
    private _changeQueue;
    private _reader;
    private _writer;
    constructor(opts: ModelOpts);
    private _create;
    private _makeChangeRequester;
    private _onChange;
    private _collectChanges;
    private _onMessage;
    private _onWrite;
}
export {};
