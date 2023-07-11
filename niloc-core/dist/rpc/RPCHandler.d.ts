import { RPC } from "./RPC";
import { Channel } from "../channel/Channel";
import { Peer } from "../core/Peer";
declare enum RPCMessageType {
    Request = 0,
    Response = 1,
    Error = 2
}
type RPCRequestMessage = {
    type: RPCMessageType.Request;
    id: string;
    name: string;
    args: any[];
};
type RPCResponseMessage = {
    type: RPCMessageType.Response;
    id: string;
    result: any;
};
type RPCErrorMessage = {
    type: RPCMessageType.Error;
    id: string;
    reason: any;
};
type RPCMessage = RPCRequestMessage | RPCResponseMessage | RPCErrorMessage;
declare namespace RPCMessage {
    function request(id: string, name: string, args: any[]): RPCMessage;
    function response(id: string, result: any): RPCMessage;
    function error(id: string, reason?: any): RPCMessage;
}
export interface RPCHandler {
    register(rpc: RPC<any, any>, id: string): void;
    infuse(object: any, id: string): void;
}
export declare class RPCHandler implements RPCHandler {
    private _self;
    private _channel;
    private _rpcs;
    private _resultEmitter;
    constructor(self: Peer, channel: Channel<RPCMessage>);
    private _makeCallHandler;
    private _onMessage;
    private _onRequest;
    private _onResponse;
    private _onError;
}
export {};
