import { Emitter } from "@niloc/utils"

type Events = {
    change: void
}

export class Resource extends Emitter<Events> {

    changed() {
        this.emit('change')
    }

}