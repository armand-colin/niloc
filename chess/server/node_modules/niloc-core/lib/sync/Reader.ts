type Buffer = string[]

export interface Reader {

    feed(buffer: Buffer): void

    cursor(): number
    setCursor(cursor: number): void
    skip(chucks: number): void

    empty(): boolean

    readJSON(): any
    readString(): string

    readFloat(): number
    readInt(): number

    readBoolean(): boolean

}

export class Reader implements Reader {

    private _buffer: Buffer = []
    private _cursor: number = 0

    feed(buffer: Buffer): void {
        this._buffer = buffer
        this._cursor = 0
    }

    cursor(): number {
        return this._cursor
    }

    setCursor(cursor: number): void {
        this._cursor = cursor
    }

    skip(chucks: number): void {
        this._cursor += chucks
    }

    empty(): boolean { return this._cursor >= this._buffer.length }

    readJSON(): any {
        const value = this._buffer[this._cursor]
        this._cursor++
        try {
            const json = JSON.parse(value)
            return json
        } catch (e) {
            console.error('Failed to parse JSON', e)
            return null
        }
    }

    readString(): string {
        return this._buffer[this._cursor++]
    }

    readFloat(): number {
        return parseFloat(this._buffer[this._cursor++])
    }

    readInt(): number {
        return parseInt(this._buffer[this._cursor++], 36)
    }

    readBoolean(): boolean {
        return this._buffer[this._cursor++] === "1"
    }

}