import { RPC } from "./RPC";
import { Channel } from "../channel/Channel";
import { Peer } from "../core/Peer";
type RPCMessage = {
    id: string;
    args: any[];
};
declare namespace RPCMessage {
    function make(id: string, args: any[]): RPCMessage;
}
export interface RPCHandler {
    register(rpc: RPC<any>, id: string): void;
    infuse(object: any, id: string): void;
}
export declare class RPCHandler implements RPCHandler {
    private _self;
    private _channel;
    private _rpcs;
    constructor(self: Peer, channel: Channel<RPCMessage>);
    private _makeCallHandler;
    private _onMessage;
    private _onRequest;
}
export {};
