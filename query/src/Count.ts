import { Column } from "./Column";
import { ColumnType } from "./ColumnType";
import { query } from "./query";
import { Visitor } from "./Visitor";

export class Count extends Column<"count", ColumnType<number>> {

    private _column: Column

    constructor(column: Column) {
        super(column.table, "count", query.number)
        this._column = column
    }

    override definition() {
        return `COUNT(${this._column.string()})`
    }

    override string() {
        return this.name
    }

    override visit(visitor: Visitor): void {
        this._column.visit(visitor)
    }

}