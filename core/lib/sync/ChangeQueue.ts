import { Emitter } from "@niloc/utils"

type Events = {
    needsSend: void
}

export class ChangeQueue extends Emitter<Events> {

    private _changes = new Set<string>()

    get needsSend(): boolean {
        return this._changes.size > 0
    }

    addChange(objectId: string) {
        const startSize = this._changes.size
        this._changes.add(objectId)

        if (startSize === 0)
            this.emit('needsSend')
    }

    deleteChange(objectId: string) {
        this._changes.delete(objectId)
    }

    *changes(): Iterable<string> {
        yield* this._changes
    }

    clear() {
        this._changes.clear()
    }

}