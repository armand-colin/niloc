import { AnyField } from "../../sync/field/AnyField";
import { SyncObject } from "../../sync/SyncObject";

type KeyOfSelf<T> = T[keyof T]
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}>

export function any<T, O extends SyncObject, K extends KeyOfType<T, O> & string>(defaultValue: T) {

    return function(target: O, propertyKey: K) {
        const accessor = '$' + propertyKey
        const storage = Symbol(propertyKey)

        Object.defineProperty(target, propertyKey, {
            get(): T {
                const field = this[accessor] as AnyField<T>
                return field.get()
            },
            set(value: T) {
                const field = this[accessor] as AnyField<T>
                field.set(value)
            },
        })

        Object.defineProperty(target, accessor, {
            get(): AnyField<T> {
                let field = this[storage] as AnyField<T>
                if (!field) {
                    field = new AnyField(defaultValue)
                    this[storage] = field
                }
                
                return field
            },
            enumerable: true
        })
    }

}