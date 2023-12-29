import { Emitter, IEmitter } from "@niloc/utils"

type Events = {
    needsSend: void
}

export class ChangeQueue {

    private _changes = new Set<string>()
    private _emitter = new Emitter<Events>()

    emitter(): IEmitter<Events> {
        return this._emitter
    }

    needsSend(): boolean {
        return this._changes.size > 0
    }

    addChange(objectId: string) {
        const startSize = this._changes.size
        this._changes.add(objectId)

        if (startSize === 0)
            this._emitter.emit('needsSend')
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