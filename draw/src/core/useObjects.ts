import { Model, SyncObject, Template } from "@niloc/core";
import { Accessor, createSignal } from "solid-js";

export function useObjects<T extends SyncObject>(model: Model, template: Template<T>): Accessor<T[]> {
    const signal = createSignal([] as T[])

    const objects = model.getAll().filter(object => object.type() === template.type)
    signal[1](objects as T[])

    model.emitter().on('created', object => {
        if (object.type() === template.type) {
            signal[1]([...signal[0](), object as T])
        }
    })

    return signal[0]
}