export interface Writer<T = any> {

    collect(): T

    cursor(): number
    setCursor(cursor: number): void
    resume(): void

    writeJSON(json: any): void
    writeString(string: string): void

    writeF32(number: number): void
    writeF64(number: number): void

    writeU(number: number): void
    
    writeU8(number: number): void
    writeU16(number: number): void
    writeU32(number: number): void
    writeU64(number: number | bigint): void

    writeI8(number: number): void
    writeI16(number: number): void
    writeI32(number: number): void
    writeI64(number: number | bigint): void

    writeBoolean(boolean: boolean): void

}