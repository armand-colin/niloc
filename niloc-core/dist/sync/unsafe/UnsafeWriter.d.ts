import { ModelWriter } from "../Synchronize";
export declare class UnsafeWriter implements ModelWriter {
    private _changes;
    constructor();
    start(objectId: string, type: string): void;
    end(): void;
    collect(): string[];
    write(value: any): void;
}
