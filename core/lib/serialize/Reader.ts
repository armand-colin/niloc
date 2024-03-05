export interface Reader<T = any> {

    feed(buffer: T): void

    cursor(): number
    setCursor(cursor: number): void
    skip(chucks: number): void

    empty(): boolean

    readJSON(): any
    readString(): string

    readF32(): number
    readF64(): number

    readU(): number
    
    readU8(): number
    readU16(): number
    readU32(): number
    readU64(): bigint

    readI8(): number
    readI16(): number
    readI32(): number
    readI64(): bigint

    readBoolean(): boolean

}