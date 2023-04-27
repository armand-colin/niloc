export interface RPCCallHandler {

    call(owner: string, args: any[]): Promise<any>

}

export interface RPC<Args extends any[], Result> {

    call(...args: Args): Promise<Result>

}

type Callback<Args extends any[], Result> = (...args: Args) => Result | Promise<Result>

export class RPC<Args extends any[], Result> implements RPC<Args, Result> {

    static setCallHandler(rpc: RPC<any, any>, handler: RPCCallHandler) {
        rpc._callHandler = handler
    }

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
    private _owner: string
    private _callHandler: RPCCallHandler | null = null

    constructor(callback: (...args: Args) => Result | Promise<Result>, owner: string) {
        this._callback = callback
        this._owner = owner
    }

    call(...args: Args): Promise<Result> {
        if (this._callHandler === null)
            return Promise.reject('Trying to call RPC without initialization')

        return this._callHandler.call(this._owner, args)
    }

}