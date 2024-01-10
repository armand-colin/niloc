import { Assert } from "../../assert/Assert"

export function custom(assertionConstructor: () => Assert) {

    return function(
        target: any, 
        propertyKey: string, 
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) {
        const accessor = '$ASSERT_' + propertyKey
        const storage = Symbol(propertyKey)

        const method = descriptor.value!

        descriptor.value = function(...args: any[]) {
            const assertion = (this as any)[accessor] as Assert
            assertion.assert()
            method.call(this, ...args!)
        }

        Object.defineProperty(target, accessor, {
            get(): Assert {
                let assertion = this[storage] as Assert
                if (!assertion) {
                    // @ts-ignore
                    assertion = assertionConstructor()
                    this[storage] = assertion
                }

                return assertion
            },
            enumerable: true
        })
    }
    
}