import { RPC } from "./RPC";
import { Channel } from "../channel/DataChannel";
import { Address } from "../main";
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
export declare class RPCHandler {
    private _id;
    private _address;
    private _channel;
    private _rpcs;
    private _resultEmitter;
    constructor(id: string, address: Address, channel: Channel<RPCMessage>);
    register(rpc: RPC<any, any>, id: string): void;
    private _makeCallHandler;
    private _onMessage;
    private _onRequest;
    private _onResponse;
    private _onError;
}
export {};
