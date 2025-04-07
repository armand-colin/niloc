import { Column } from "./Column"
import { ColumnType } from "./ColumnType"
import { Count } from "./Count"
import { Insert, InsertMultiple, InsertOne } from "./Insert"
import { And } from "./operators/And"
import { Or } from "./operators/Or"
import { Query } from "./QueryClass"
import { Select } from "./Select"
import { Statement } from "./Statement"
import { Table } from "./Table"

class Inserting<T extends Column[]> {

    constructor(readonly table: Table, readonly columns: T) { }

    values(values: Insert.Values<T>): InsertOne<T, []>
    values(values: Insert.Values<T>[]): InsertMultiple<T>
    values(values: Insert.Values<T> | Insert.Values<T>[]): InsertOne<T, []> | InsertMultiple<T> {
        if (Array.isArray(values))
            return new InsertMultiple(this.table, this.columns, values)

        return new InsertOne(this.table, this.columns, [], values)
    }

}

export namespace query {

    export type result<T extends Query> = Query.Result<T>

    export function select<C extends Column[]>(...columns: C) {
        return {
            from<TableType extends Table>(table: TableType): Select<{ 
                joins: [],
                columns: C,
                table: TableType,
                where: null
            }> {
                return new Select({
                    table,
                    columns,
                    joins: [],
                    where: null
                })
            }
        }
    }

    export function insert<T extends Column[]>(...columns: T): Inserting<T> {
        if (columns.length === 0)
            throw new Error("Cannot insert empty row")

        const table = columns[0].table

        return new Inserting(table, columns)
    }

    export function or<A extends Statement, B extends Statement>(a: A, b:B) {
        return new Or(a, b)
    }

    export function and<A extends Statement, B extends Statement>(a: A, b:B) {
        return new And(a, b)
    }

    export function count(column: Column) {
        return new Count(column)
    }

    // Column types
    export const string = ColumnType.String
    export const date = ColumnType.Date
    export const number = ColumnType.Number

}

