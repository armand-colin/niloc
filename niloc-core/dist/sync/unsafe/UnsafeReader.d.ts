import { ModelReader } from "../Synchronize";
export declare class UnsafeReader implements ModelReader {
    private _changes;
    private _cursor;
    private _payload;
    feed(changes: string[]): void;
    start(): {
        objectId: string;
        type: string;
    } | null;
    read(): any;
    end(): void;
}
