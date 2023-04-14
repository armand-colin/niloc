import { ModelChangeReader } from "../Synchronize";

export class ChangeReader implements ModelChangeReader {

    private _changes: string[] = []

    private _cursor: number = 0
    private _payload = { objectId: "", fieldCount: 0, changeCount: 0 }
    private _objectHead = 0

    feed(changes: string[]) {
        this._cursor = 0
        this._changes = changes
    }

    start(): { objectId: string, fieldCount: number } | null {
        if (this._cursor >= this._changes.length)
            return null

        this._payload.objectId = this._changes[this._cursor]
        this._payload.fieldCount = parseInt(this._changes[this._cursor + 1])
        this._payload.changeCount = parseInt(this._changes[this._cursor + 2])
        
        this._cursor += 3

        this._objectHead = this._cursor

        return this._payload
    }

    field(): number {
        const fieldIndex = parseInt(this._changes[this._cursor])
        this._cursor++
        return fieldIndex
    }

    read(): any {
        try {
            const value = JSON.parse(this._changes[this._cursor])
            this._cursor++
            return value
        } catch (e) {
            console.error('Error while reading changes: ', e);
            return null
        }
    }

    skip() {
        this._cursor = this._objectHead + this._payload.changeCount
    }

}