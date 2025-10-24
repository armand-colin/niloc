import { Emitter } from "@niloc/utils"
import type { Engine } from "./Engine"

type Events = {
    change: void
}

export class Resource extends Emitter<Events> {

    constructor(protected readonly engine: Engine) {
        super()
    }

    changed() {
        this.emit('change')
    }

}