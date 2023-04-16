type Buffer = string[];
export interface Writer {
    collect(): Buffer;
    cursor(): number;
    setCursor(cursor: number): void;
    resume(): void;
    writeJSON(json: any): void;
    writeString(string: string): void;
    writeFloat(number: number): void;
    writeInt(number: number): void;
    writeBoolean(boolean: boolean): void;
}
export declare class Writer implements Writer {
    private _buffer;
    private _cursor;
    private _write;
}
export {};
