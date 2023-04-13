export interface Writer {
    write(value: any): void;
}
export interface Reader {
    read(): any;
}
export interface ChangeRequester {
    change(): void;
}
export interface ModelReader extends Reader {
    feed(changes: string[]): void;
    start(): {
        objectId: string;
        type: string;
    } | null;
    end(): void;
}
export interface ModelWriter extends Writer {
    start(objectId: string, type: string): void;
    end(): void;
    collect(): string[];
}
