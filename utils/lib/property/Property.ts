import { Emitter } from "../Emitter"
import { PropertyPipe } from "./PropertyPipe"
import * as pipes from "./pipes/main"

type Events<T> = {
    change: T,
    destroy: void
}

type Equals<T> = (a: T, b: T) => boolean

const DefaultEquals: Equals<any> = (a, b) => a === b

export class Property<T> {

    private _value: T
    private _equals: Equals<T>
    private _destroy?: () => void
    private _destroyed = false

    protected readonly emitter = new Emitter<Events<T>>()

    constructor(value: T, opts?: Property.Options<T>) {
        this._value = value
        this._equals = opts?.equals ?? DefaultEquals
        this._destroy = opts?.destroy
    }

    get value() {
        return this._value
    }

    set value(value: T) {
        if (this._equals(this._value, value))
            return

        this._value = value
        this.emitter.emit('change', value)
    }

    on = this.emitter.on.bind(this.emitter)
    off = this.emitter.off.bind(this.emitter)

    pipe<U>(pipe: PropertyPipe<T, U>): Property<U> {
        const property = pipe(this)
        this.emitter.on('destroy', () => property.destroy())
        return property
    }

    destroy() {
        if (this._destroyed)
            return

        this.emitter.removeAllListeners()
        this._destroy?.()
        this.emitter.emit('destroy')
        this._destroyed = true
    }

}

export namespace Property {

    export type Options<T> = {
        equals?: Equals<T>,
        destroy?: () => void
    }

    type UnNest<T extends Record<string, Property<any>>> = {
        [K in keyof T]: T[K] extends Property<infer V> ? V : never
    }

    export function all<T extends Record<string, Property<any>>>(
        properties: T,
        opts?: Options<UnNest<T>>
    ): Property<UnNest<T>> {

        function get() {
            const value: any = {}
            for (const key in properties)
                value[key] = properties[key].value
            return value as UnNest<T>
        }

        const property = new Property<UnNest<T>>(get(), opts)

        function update() {
            const value = get()
            property.value = value
        }

        function destroy() {
            property.destroy()
        }

        for (const key in properties) {
            const property = properties[key]
            property.on('change', update)
            property.on('destroy', destroy)
        }

        return property
    }

    export const debounce = pipes.debounce
    export const map = pipes.map

}