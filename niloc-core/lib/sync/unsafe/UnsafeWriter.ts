import { ModelWriter } from "../Synchronize";

export class UnsafeWriter implements ModelWriter {

    private _changes: string[] = []

    constructor() {}

    start(objectId: string, type: string): void {
        this._changes.push(objectId)
        this._changes.push(type)
    }

    end(): void { }

    collect(): string[] {
        const changes = this._changes
        this._changes = []
        return changes
    }

    write(value: any): void {
        this._changes.push(JSON.stringify(value))
    }

}