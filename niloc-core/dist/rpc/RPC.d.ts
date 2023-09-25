import { Address } from "../core/Address";
export interface RPCCallHandler {
    call(address: Address, args: any[]): void;
}
export interface RPC<Args extends any[]> {
    call(...args: Args): void;
}
type Callback<Args extends any[]> = (...args: Args) => void;
export declare class RPC<Args extends any[]> implements RPC<Args> {
    static setCallHandler(rpc: RPC<any>, handler: RPCCallHandler): void;
    static host<Args extends any[]>(callback: Callback<Args>): RPC<Args>;
    static target<Args extends any[]>(targetId: string, callback: Callback<Args>): RPC<Args>;
    static broadcast<Args extends any[]>(callback: Callback<Args>): RPC<Args>;
    static all<Args extends any[]>(callback: Callback<Args>): RPC<Args>;
    static dynamic<Args extends any[]>(getTargetId: () => string, callback: Callback<Args>): RPC<Args>;
    static call<Args extends any[]>(rpc: RPC<Args>, args: Args): void;
    private _callback;
    private _callHandler;
    protected address: Address;
    constructor(address: Address, callback: Callback<Args>);
}
export {};
