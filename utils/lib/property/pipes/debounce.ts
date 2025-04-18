import { Property } from "../Property";
import { PropertyPipe } from "../PropertyPipe";

export function debounce<T>(milliseconds: number): PropertyPipe<T, T> {

    return function (property: Property<T>) {
        let timeout: number | null = null

        const debounced = new Property(
            property.value,
            { equals: () => false }
        )

        property.on('change', value => {
            if (timeout !== null)
                clearTimeout(timeout)

            timeout = setTimeout(() => {
                debounced.value = value
                timeout = null
            }, milliseconds, undefined)
        })

        return debounced
    }
}