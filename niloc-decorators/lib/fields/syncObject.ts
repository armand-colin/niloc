import { SyncObject, SyncObjectField, Template } from "niloc-core";

type KeyOfSelf<T> = T[keyof T]
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}>

export function syncObject<Type extends SyncObject, Source extends SyncObject, Key extends KeyOfType<Type, Source> & string>(template: Template<Type>) {

    return function(target: Source, propertyKey: Key) {
        const accessor = '$' + propertyKey
        const storage = Symbol(propertyKey)

        Object.defineProperty(target, propertyKey, {
            get(): Type {
                const field = this[accessor] as SyncObjectField<Type>
                return field.get()
            }
        })

        Object.defineProperty(target, accessor, {
            get(): SyncObjectField<Type> {
                let field = this[storage] as SyncObjectField<Type>
                if (!field)
                    field = new SyncObjectField(template)
                return field
            },
            enumerable: true
        })
    }

}