import { SyncObjectType } from "../../main"
import { SyncObjectField } from "../../sync/field/SyncObjectField"
import { SyncObject } from "../../sync/SyncObject"

type KeyOfSelf<T> = T[keyof T]
type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}>

export function syncObject<Type extends SyncObject, Source extends SyncObject, Key extends KeyOfType<Type, Source> & string>(type: SyncObjectType<Type>) {

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
                if (!field) {
                    field = new SyncObjectField(type)
                    this[storage] = field
                }
                return field
            },
            enumerable: true
        })
    }

}