import { ModelHandle } from "../ModelHandle";
import { Plugin } from "../Plugin";
import { ConnectionList } from "./ConnectionList";
export declare class ConnectionPlugin implements Plugin {
    private _model;
    constructor(connectionList: ConnectionList);
    init(model: ModelHandle): void;
    private _onConnected;
    private _onSync;
}
