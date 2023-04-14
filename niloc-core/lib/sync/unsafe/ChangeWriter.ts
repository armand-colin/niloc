import { ModelChangeWriter } from "../Synchronize";

export class ChangeWriter implements ModelChangeWriter {

    private _changes: string[] = []
    private _objectChangesHead = 0

    constructor() {}

    start(objectId: string, fieldCount: number): void {
        this._changes.push(objectId)
        this._changes.push(fieldCount.toString())
        this._changes.push("")
        this._objectChangesHead = this._changes.length - 1
    }

    end(): void {
        this._changes[this._objectChangesHead] = (this._changes.length - this._objectChangesHead - 1).toString()
    }

    field(field: number): void {
        this._changes.push(field.toString())
    }

    collect(): string[] {
        const changes = this._changes
        this._changes = []
        return changes
    }

    write(value: any): void {
        this._changes.push(JSON.stringify(value))
    }

}