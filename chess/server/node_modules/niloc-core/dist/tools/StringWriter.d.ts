export declare class StringWriter {
    private _indent;
    private _string;
    private _line;
    write(string: string): void;
    writeLine(string: string): void;
    nextLine(): void;
    startIndent(): void;
    endIndent(): void;
    toString(): string;
}
