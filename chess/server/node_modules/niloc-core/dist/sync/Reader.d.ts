type Buffer = string[];
export interface Reader {
    feed(buffer: Buffer): void;
    cursor(): number;
    setCursor(cursor: number): void;
    skip(chucks: number): void;
    empty(): boolean;
    readJSON(): any;
    readString(): string;
    readFloat(): number;
    readInt(): number;
    readBoolean(): boolean;
}
export declare class Reader implements Reader {
    private _buffer;
    private _cursor;
}
export {};
