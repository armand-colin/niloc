import type { Emitter } from "@niloc/utils"
import { Emitter as EmitterImpl  } from "@niloc/utils"

type Events = {
    needsSend: void
}

export class ChangeQueue {

    private _changes = new Map<string, number[]>()
    private _syncs = new Set<string>()
    private _emitter = new EmitterImpl<Events>

    emitter(): Emitter<Events> {
        return this._emitter
    }

    needsSend(): boolean {
        return this._syncs.size > 0 || this._changes.size > 0
    }

    change(objectId: string, fieldIndex: number) {
        if (this._syncs.has(objectId))
            return

        let changes = this._changes.get(objectId)

        if (!changes) {
            changes = []
            this._changes.set(objectId, changes)
        }

        if (changes.includes(fieldIndex))
            return

        changes.push(fieldIndex)
    }

    sync(objectId: string) {
        this._syncs.add(objectId)
        this._changes.delete(objectId)
    }

    *changes(): Iterable<{ objectId: string, fields: number[] }> {
        const payload = { objectId: "", fields: [] as number[] }
        for (const [objectId, fields] of this._changes) {
            payload.objectId = objectId
            payload.fields = fields
            yield payload
        }
        this._changes.clear()
    }

    *syncs(): Iterable<string> {
        for (const objectId of this._syncs)
            yield objectId
        this._syncs.clear()
    }

    changeForObject(objectId: string): number[] | null {
        const fields = this._changes.get(objectId)
        this._changes.delete(objectId)
        return fields ?? null
    }

}