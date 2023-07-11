import { Address } from "../core/Address"

export interface RPCCallHandler {

    call(address: Address, args: any[]): Promise<any>

}

export interface RPC<Args extends any[], Result> {

    call(...args: Args): Promise<Result>

}

type Callback<Args extends any[], Result> = (...args: Args) => Result | Promise<Result>

export class RPC<Args extends any[], Result> implements RPC<Args, Result> {

    static setCallHandler(rpc: RPC<any, any>, handler: RPCCallHandler) {
        rpc._callHandler = handler
    }

    static host<Args extends any[], Result>(callback: Callback<Args, Result>): RPC<Args, Result> {
        return new RPC(Address.host(), callback)
    }

    static target<Args extends any[], Result>(targetId: string, callback: Callback<Args, Result>): RPC<Args, Result> {
        return new RPC(Address.to(targetId), callback)
    }

    // Called by the RPC Handler to execute the real code
    static call<Args extends any[], Result>(rpc: RPC<Args, Result>, args: Args): Promise<Result> {
        try {
            const result = rpc._callback(...args)
            if (result instanceof Promise)
                return result
            return Promise.resolve(result)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    private _callback: Callback<Args, Result>
    private _callHandler: RPCCallHandler | null = null

    protected address: Address

    constructor(address: Address, callback: (...args: Args) => Result | Promise<Result>) {
        this._callback = callback
        this.address = address
    }

    call(...args: Args): Promise<Result> {
        if (this._callHandler === null)
            return Promise.reject('Trying to call RPC without initialization')

        return this._callHandler.call(this.address, args)
    }

}