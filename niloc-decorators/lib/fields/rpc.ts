import { Address, AnyField, RPC, SyncObject } from "@niloc/core";

type KeyOfSelf<T> = T[keyof T]
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}>

export function host<Args extends any[], O, K extends KeyOfType<(...args: Args) => any, O> & string>() {

    return function(target: O, propertyKey: K) {
        const accessor = '$' + propertyKey
        const storage = Symbol(propertyKey)
        const callStorage = Symbol('call.' + propertyKey)

        const method = target[propertyKey] as (...args: Args) => any

        Object.defineProperty(target, propertyKey, {
            get(): (...args: Args) => any {
                const call = this[accessor] as (...args: Args) => any 
                return call
            }
        })

        Object.defineProperty(target, accessor, {
            get(): RPC<Args> {
                let rpc = this[storage] as RPC<Args>
                if (!rpc) {
                    rpc = new RPC(Address.host(), method.bind(this))
                    this[storage] = rpc
                }

                return field
            },
            enumerable: true
        })
    }

}