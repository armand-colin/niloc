export interface Writer {
    write(value: any): void
}

export interface Reader {
    read(): any
}

export interface ChangeRequester {
    change(fieldIndex: number): void
}

export interface ModelSyncReader extends Reader {
    feed(changes: string[]): void
    start(): { objectId: string, type: string } | null
}

export interface ModelSyncWriter extends Writer {
    start(objectId: string, type: string): void
    collect(): string[]
}

export interface ModelChangeReader extends Reader {
    feed(changes: string[]): void
    start(): { objectId: string, fieldCount: number } | null
    field(): number
    skip(): void
}

export interface ModelChangeWriter extends Writer {
    start(objectId: string, fieldCount: number): void
    end(): void
    field(field: number): void
    collect(): string[]
}