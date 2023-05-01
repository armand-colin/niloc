import { Address } from "../main";
export interface RPCCallHandler {
    call(address: Address, args: any[]): Promise<any>;
}
export interface RPC<Args extends any[], Result> {
    call(...args: Args): Promise<Result>;
}
type Callback<Args extends any[], Result> = (...args: Args) => Result | Promise<Result>;
export declare class RPC<Args extends any[], Result> implements RPC<Args, Result> {
    static setCallHandler(rpc: RPC<any, any>, handler: RPCCallHandler): void;
    static host<Args extends any[], Result>(callback: Callback<Args, Result>): RPC<Args, Result>;
    static target<Args extends any[], Result>(targetId: string, callback: Callback<Args, Result>): RPC<Args, Result>;
    static call<Args extends any[], Result>(rpc: RPC<Args, Result>, args: Args): Promise<Result>;
    private _callback;
    private _callHandler;
    protected address: Address;
    constructor(address: Address, callback: (...args: Args) => Result | Promise<Result>);
}
export {};
