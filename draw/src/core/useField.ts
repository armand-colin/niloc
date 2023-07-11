import { AnyField } from "@niloc/core";
import { Accessor, createSignal, onCleanup } from "solid-js";

export function useField<T>(field: AnyField<T>): Accessor<T> {
    const [value, setValue] = createSignal(field.get())

    function onChange() {
        setValue(() => field.get())
    }

    field.emitter().on("changed", onChange)

    onCleanup(() => {
        field.emitter().off("changed", onChange)
    })

    return value
}