export interface RPCCallHandler {
    call(owner: string, args: any[]): Promise<any>;
}
export interface RPC<Args extends any[], Result> {
    call(...args: Args): Promise<Result>;
}
export declare class RPC<Args extends any[], Result> implements RPC<Args, Result> {
    static setCallHandler(rpc: RPC<any, any>, handler: RPCCallHandler): void;
    static call<Args extends any[], Result>(rpc: RPC<Args, Result>, args: Args): Promise<Result>;
    private _callback;
    private _owner;
    private _callHandler;
    constructor(callback: (...args: Args) => Promise<Result>, owner: string);
}
/**
 * What do I want ?
 *
 * const rpc = new RPC(async (n: number): Promise<string> => {
 *      return n.toString()
 * }, )
 *
 */ 
