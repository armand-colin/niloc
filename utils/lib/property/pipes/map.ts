import { Property } from "../Property";
import { PropertyPipe } from "../PropertyPipe";

export function map<T, U>(mapper: (value: T) => U, opts?: Property.Options<U>): PropertyPipe<T, U> {

    return function (property: Property<T>) {
        const mapped = new Property<U>(
            mapper(property.value),
            opts
        )

        property.on('change', value => {
            mapped.value = mapper(value)
        })

        return mapped
    }

}