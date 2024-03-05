import { Writer } from "./Writer"

type Buffer = Uint8Array

const BUFFER_UNIT_SIZE = 4096

export class BinaryWriter implements Writer<Buffer> {

    private _buffer: Buffer
    private _view: DataView

    private _cursor: number = 0;
    private _length: number = 0;

    private _stringEncoder = new TextEncoder();

    constructor(unitSize: number = BUFFER_UNIT_SIZE) { 
        this._buffer = new Uint8Array(unitSize);
        this._view = new DataView(this._buffer.buffer, 0);
    }

    collect(): Buffer {
        const buffer = this._buffer.slice(0, this._cursor)
        this._cursor = 0
        this._length = 0
        return buffer
    }

    cursor(): number {
        return this._cursor
    }

    setCursor(cursor: number): void {
        if (cursor >= this._buffer.length)
            this._allocate(cursor)

        this._cursor = cursor

        if (cursor > this._length)
            this._length = cursor
    }

    resume(): void {
        this._cursor = this._length
    }

    private _allocate(minSize: number): void {
        let newSize = this._buffer.length
        while (newSize < minSize)
            newSize *= 2

        // Shall reallocate
        if (newSize === this._buffer.length)
            return

        const newBuffer = new Uint8Array(newSize)
        newBuffer.set(this._buffer)
        this._buffer = newBuffer
    }

    private _write(buffer: ArrayBuffer): void {
        const cursor = this._cursor
        const size = buffer.byteLength

        if (cursor + size > this._buffer.length)
            this._allocate(cursor + size)

        this._buffer.set(new Uint8Array(buffer), cursor)
        this._cursor += size
        this._length += size
    }

    writeJSON(json: any): void {
        const string = JSON.stringify(json)
        this.writeString(string)
    }

    writeString(string: string): void {
        const buffer = this._stringEncoder.encode(string)
        this.writeU32(buffer.byteLength)
        this._write(buffer)
    }

    writeF32(number: number): void {
        this._view.setFloat32(this._cursor, number)
        this.setCursor(this._cursor + 4)
    }

    writeF64(number: number): void {
        this._view.setFloat64(this._cursor, number)
        this.setCursor(this._cursor + 8)
    }


    writeBoolean(boolean: boolean): void {
        this.writeU8(boolean ? 1 : 0)
    }

    writeU(number: number): void {
        if (number < 0)
            throw new Error(`Cannot write negative number ${number}`)

        if (number < 0x100) {
            this.writeU8(1)
            this.writeU8(number)
        } else if (number < 0x10000) {
            this.writeU8(2)
            this.writeU16(number)
        } else if (number < 0x100000000) {
            this.writeU8(4)
            this.writeU32(number)
        } else {
            this.writeU8(8)
            this.writeU64(BigInt(number))
        }
    }

    writeU8(number: number): void {
        this._view.setUint8(this._cursor, number)
        this.setCursor(this._cursor + 1)
    }

    writeU16(number: number): void {
        this._view.setUint16(this._cursor, number)
        this.setCursor(this._cursor + 2)
    }

    writeU32(number: number): void {
        this._view.setUint32(this._cursor, number)
        this.setCursor(this._cursor + 4)
    }

    writeU64(number: bigint | number): void {
        this._view.setBigUint64(this._cursor, BigInt(number))
        this.setCursor(this._cursor + 8)
    }


    writeI8(number: number): void {
        this._view.setInt8(this._cursor, number)
        this.setCursor(this._cursor + 1)
    }

    writeI16(number: number): void {
        this._view.setInt16(this._cursor, number)
        this.setCursor(this._cursor + 2)
    }

    writeI32(number: number): void {
        this._view.setInt32(this._cursor, number)
        this.setCursor(this._cursor + 4)
    }

    writeI64(number: number | bigint): void {
        this._view.setBigInt64(this._cursor, BigInt(number))
        this.setCursor(this._cursor + 8)
    }


}