import { ArrayField } from "@niloc/core";
import { Accessor, createSignal, onCleanup } from "solid-js";

export function useArrayField<T>(field: ArrayField<T>): Accessor<ReadonlyArray<T>> {
    const [value, setValue] = createSignal(field.get(), { equals: false })

    function onChange() {
        setValue(() => field.get())
    }

    field.emitter().on("changed", onChange)

    onCleanup(() => {
        field.emitter().off("changed", onChange)
    })

    return value
}