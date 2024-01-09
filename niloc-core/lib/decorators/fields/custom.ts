import { Field } from "../../main";
import { SyncObject } from "../../sync/SyncObject";

type KeyOfSelf<T> = T[keyof T]
export type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}> & string

export function custom<
    T,
    Source extends SyncObject,
    Key extends KeyOfType<T, Source>
>(fieldType: () => Field<T>) {

    return function (target: Source, propertyKey: Key) {

        const accessor = '$' + propertyKey
        const storage = Symbol(propertyKey)

        Object.defineProperty(target, propertyKey, {
            get(): T {
                const field = this[accessor] as Field<T>
                return field.get()
            },
            set(value: T) {
                const field = this[accessor] as Field<T>
                field.set(value)
            },
        })

        Object.defineProperty(target, accessor, {
            get(): Field<T> {
                let field = this[storage] as Field<T>
                if (!field) {
                    field = fieldType()
                    this[storage] = field
                }

                return field
            },
            enumerable: true
        })

    }

}