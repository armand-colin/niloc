import { Address, RPC, SyncObject } from "@niloc/core";

type KeyOfSelf<T> = T[keyof T]
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}>

function _rpc<
    Args extends any[], 
    O, 
    K extends KeyOfType<(...args: Args) => any, O> & string
>(getAddress: (object: O) => Address) {

    return function(target: O, propertyKey: K, descriptor: TypedPropertyDescriptor<(...args: Args) => any>) {
        const accessor = '$' + propertyKey
        const storage = Symbol(propertyKey)

        const method = descriptor.value

        descriptor.value = function(...args: Args) {
            const rpc = (this as any)[accessor] as RPC<Args>
            rpc.call(...args)
        }

        Object.defineProperty(target, accessor, {
            get(): RPC<Args> {
                let rpc = this[storage] as RPC<Args>
                if (!rpc) {
                    // @ts-ignore
                    rpc = new RPC(getAddress(this as O), method.bind(this as any))
                    rpc.call = rpc.call.bind(rpc)
                    this[storage] = rpc
                }

                return rpc
            },
            enumerable: true
        })
    }
    
}

export function host<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>() {
    return _rpc<Args, O, K>(Address.host)
}

export function all<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>() {
    return _rpc<Args, O, K>(Address.all)
}

export function broadcast<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>() {
    return _rpc<Args, O, K>(Address.broadcast)
}

export function owner<Args extends any[], O extends SyncObject, K extends KeyOfType<(...args: Args) => any, O> & string>() {
    return _rpc<Args, O, K>(object => Address.to(object.id()))
}

export function dynamic<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>(getTargetId: () => string) {
    return _rpc<Args, O, K>(() => Address.dynamic(getTargetId))
}

export const rpc = {
    host,
    all,
    broadcast,
    owner,
    dynamic
}