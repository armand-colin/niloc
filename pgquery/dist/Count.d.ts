import { Column } from "./Column";
import { ColumnType } from "./ColumnType";
import { Visitor } from "./Visitor";
export declare class Count extends Column<"count", string, ColumnType<number>> {
    private _column;
    constructor(column: Column);
    definition(): string;
    string(): "count";
    visit(visitor: Visitor): void;
}
