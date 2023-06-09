type Buffer = string[]

export interface Writer {

    collect(): Buffer

    cursor(): number
    setCursor(cursor: number): void
    resume(): void

    writeJSON(json: any): void
    writeString(string: string): void

    writeFloat(number: number): void
    writeInt(number: number): void

    writeBoolean(boolean: boolean): void

}

export class Writer implements Writer {

    private _buffer: Buffer = []
    private _cursor: number = -1

    collect(): Buffer {
        const buffer = this._buffer
        this._buffer = []
        return buffer
    }

    cursor(): number {
        if (this._cursor === -1)
            return this._buffer.length
        return this._cursor
    }

    setCursor(cursor: number): void {
        if (cursor === this._buffer.length)
            cursor = -1
        this._cursor = cursor
    }

    resume(): void {
        this.setCursor(-1)
    }

    private _write(value: string): void {
        if (this._cursor === -1)
            this._buffer.push(value)
        else
            this._buffer[this._cursor++] = value
    }

    writeJSON(json: any): void {
        this._write(JSON.stringify(json))
    }

    writeString(string: string): void {
        this._write(string)
    }

    writeInt(number: number): void {
        this._write(number.toString(36))
    }

    writeFloat(number: number): void {
        this._write(number.toString())
    }

    writeBoolean(boolean: boolean): void {
        this._write(boolean ? "1" : "0")
    }

}