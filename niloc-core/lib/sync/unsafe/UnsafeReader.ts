import { ModelReader } from "../Synchronize";

export class UnsafeReader implements ModelReader {

    private _changes: string[] = []

    private _cursor: number = 0
    private _payload = { objectId: "", type: "" }

    feed(changes: string[]) {
        this._changes = changes
    }

    start(): { objectId: string, type: string } | null {
        if (this._cursor >= this._changes.length)
            return null

        this._payload.objectId = this._changes[this._cursor]
        this._payload.type = this._changes[this._cursor + 1]
        
        this._cursor +=2

        return this._payload
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

    end(): void { }

}