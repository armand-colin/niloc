import { SyncObject, SyncObjectRefField } from "niloc-core";

type KeyOfSelf<T> = T[keyof T]
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}>

export function syncObjectRef<Type extends SyncObject, Source extends SyncObject, Key extends KeyOfType<Type | null, Source> & string>(objectId: string | null) {

    return function (target: Source, propertyKey: Key) {
        const accessor = '$' + propertyKey
        const storage = Symbol(propertyKey)

        Object.defineProperty(target, propertyKey, {
            get(): Type | null {
                const field = this[accessor] as SyncObjectRefField<Type>
                return field.get()
            },
            set(value: Type | null) {
                const field = this[accessor] as SyncObjectRefField<Type>
                field.set(value)
            }
        })

        Object.defineProperty(target, accessor, {
            get(): SyncObjectRefField<Type> {
                let field = this[storage] as SyncObjectRefField<Type>
                if (!field)
                    field = new SyncObjectRefField(objectId)
                return field
            },
            enumerable: true
        })
    }

}