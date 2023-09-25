import { Address } from "../core/Address"

export interface RPCCallHandler {

    call(address: Address, args: any[]): void

}

export interface RPC<Args extends any[]> {

    call(...args: Args): void

}

type Callback<Args extends any[]> = (...args: Args) => void

export class RPC<Args extends any[]> implements RPC<Args> {

    static setCallHandler(rpc: RPC<any>, handler: RPCCallHandler) {
        rpc._callHandler = handler
    }

    static host<Args extends any[]>(callback: Callback<Args>): RPC<Args> {
        return new RPC(Address.host(), callback)
    }
    
    static target<Args extends any[]>(targetId: string, callback: Callback<Args>): RPC<Args> {
        return new RPC(Address.to(targetId), callback)
    }

    static broadcast<Args extends any[]>(callback: Callback<Args>): RPC<Args> {
        return new RPC(Address.broadcast(), callback)
    }

    static all<Args extends any[]>(callback: Callback<Args>): RPC<Args> {
        return new RPC(Address.all(), callback)
    }

    static dynamic<Args extends any[]>(getTargetId: () => string, callback: Callback<Args>): RPC<Args> {
        return new RPC(Address.dynamic(getTargetId), callback)
    }

    // Called by the RPC Handler to execute the real code
    static call<Args extends any[]>(rpc: RPC<Args>, args: Args): void {
        try {
            rpc._callback(...args)
        } catch (e) {
            console.error('Error while executing RPC:', e)
        }
    }

    private _callback: Callback<Args>
    private _callHandler: RPCCallHandler | null = null

    protected address: Address

    constructor(address: Address, callback: Callback<Args>) {
        this._callback = callback
        this.address = address
    }

    call(...args: Args): void {
        if (this._callHandler === null)
            throw new Error('Trying to call RPC without initialization')

        return this._callHandler.call(this.address, args)
    }

}