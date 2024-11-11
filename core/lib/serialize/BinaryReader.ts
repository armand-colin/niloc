import { Reader } from "./Reader"

type Buffer = Uint8Array

const EMPTY_BUFFER = new Uint8Array(0)

export class BinaryReader implements Reader<Buffer> {

    private _buffer: Buffer
    private _view: DataView
    private _cursor: number

    private _stringDecoder = new TextDecoder()

    constructor(buffer?: Buffer) {
        this._buffer = buffer ?? EMPTY_BUFFER
        this._view = new DataView(this._buffer.buffer, 0)
        this._cursor = 0
    }

    feed(buffer: Buffer): void {
        this._buffer = buffer
        this._view = new DataView(this._buffer.buffer, this._buffer.byteOffset, this._buffer.byteLength)
        this._cursor = 0
    }

    cursor(): number {
        return this._cursor
    }

    setCursor(cursor: number): void {
        if (cursor > this._buffer.length)
            throw new Error(`Cursor out of bounds: ${cursor} >= ${this._buffer.length}. Reading has exceeded the buffer size`)

        this._cursor = cursor
    }

    skip(chucks: number): void {
        this.setCursor(this._cursor + chucks)
    }

    empty(): boolean {
        return this._cursor >= this._buffer.length
    }

    read(length: number): Uint8Array {
        const buffer = this._buffer.subarray(this._cursor, this._cursor + length)
        this.setCursor(this._cursor + length)
        return buffer
    }

    readJSON(): any {
        try {
            const string = this.readString()
            const json = JSON.parse(string)
            return json
        } catch (e) {
            console.error('Failed to parse JSON', e)
            return null
        }
    }

    readString(): string {
        const size = this.readU32()
        const buffer = this._buffer.subarray(this._cursor, this._cursor + size)
        this.setCursor(this._cursor + size)
        return this._stringDecoder.decode(buffer)
    }


    readF32(): number {
        const value = this._view.getFloat32(this._cursor)
        this.setCursor(this._cursor + 4)
        return value
    }
    readF64(): number {
        const value = this._view.getFloat64(this._cursor)
        this.setCursor(this._cursor + 8)
        return value
    }


    readU(): number {
        const size = this.readU8()
        switch (size) {
            case 1: return this.readU8()
            case 2: return this.readU16()
            case 4: return this.readU32()
            case 8: return Number(this.readU64())
            default: throw new Error(`Unsupported size: ${size}`)
        }
    }

    readU8(): number {
        const value = this._view.getUint8(this._cursor)
        this.setCursor(this._cursor + 1)
        return value
    }
    readU16(): number {
        const value = this._view.getUint16(this._cursor)
        this.setCursor(this._cursor + 2)
        return value
    }
    readU32(): number {
        const value = this._view.getUint32(this._cursor)
        this.setCursor(this._cursor + 4)
        return value
    }
    readU64(): bigint {
        const value = this._view.getBigUint64(this._cursor)
        this.setCursor(this._cursor + 8)
        return value
    }

    readI8(): number {
        const value = this._view.getInt8(this._cursor)
        this.setCursor(this._cursor + 1)
        return value
    }
    readI16(): number {
        const value = this._view.getInt16(this._cursor)
        this.setCursor(this._cursor + 2)
        return value
    }
    readI32(): number {
        const value = this._view.getInt32(this._cursor)
        this.setCursor(this._cursor + 4)
        return value
    }
    readI64(): bigint {
        const value = this._view.getBigInt64(this._cursor)
        this.setCursor(this._cursor + 8)
        return value
    }

    readBoolean(): boolean {
        return this.readU8() === 1
    }

}