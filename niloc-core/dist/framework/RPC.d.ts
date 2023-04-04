import { Emitter } from "utils";
import { Message } from "../core/Message";
type HandleCallback = (e: {
    data?: any;
    originId: string;
}) => any;
interface RPCHandlerEvents {
    message: {
        targetId: string;
        message: RPCMessage;
    };
}
export interface RPC {
    handle(identifier: string, callback: HandleCallback): void;
    request(identifier: string, targetId: string, data?: any): Promise<any>;
}
export interface RPCHandler extends RPC {
    emitter(): Emitter<RPCHandlerEvents>;
    post(message: Message): void;
}
declare enum RPCMessageType {
    Request = 0,
    Response = 1,
    Error = 2
}
type RPCRequestMessage = {
    type: RPCMessageType.Request;
    id: string;
    name: string;
    data?: any;
};
type RPCResponseMessage = {
    type: RPCMessageType.Response;
    id: string;
    data?: any;
};
type RPCErrorMessage = {
    type: RPCMessageType.Error;
    id: string;
    reason?: any;
};
type RPCMessage = RPCRequestMessage | RPCResponseMessage | RPCErrorMessage;
declare namespace RPCMessage {
    function request(id: string, name: string, data?: any): RPCMessage;
    function response(id: string, data?: any): RPCMessage;
    function error(id: string, reason?: any): RPCMessage;
}
export declare class RPCHandler implements RPCHandler {
    private _emitter;
    private _handlers;
    private _resultEmitter;
    constructor();
    handle(name: string, callback: HandleCallback): void;
    request(name: string, targetId: string, data?: any): Promise<any>;
    private _onRequest;
    private _onResponse;
    private _onError;
}
export {};
