import { Emitter } from "@niloc/utils"
import { nanoid } from "nanoid"
import type { Engine } from "./Engine"

type Events = {
    change: void
}

export class Component extends Emitter<Events> {

    readonly id = nanoid()

    constructor(protected readonly engine: Engine) {
        super()
    }

    changed() {
        this.emit('change')
    }

}