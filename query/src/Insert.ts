import { Column } from "./Column"
import { ColumnType } from "./ColumnType"
import { Param } from "./Param"
import { ParamValue } from "./ParamValue"
import { Query } from "./QueryClass"
import { Table } from "./Table"
import { Visitor } from "./Visitor"

export namespace Insert {

    export type Values<C extends Column[]> =
        C extends [infer First, ...infer Rest] ?
        First extends Column<infer Name, infer Type> ?
        Rest extends Column[] ?
        Record<Name, ColumnType.Type<Type> | Param<ColumnType.Type<Type>>> & Values<Rest> :
        {} : 
        {} :
        {}

    export function parseColumns<C extends Column[]>(columns: C, values: Values<C>) {
        const params = []
        for (const column of columns) {
            const value = values[column.name as keyof typeof values]
            if (value instanceof Param)
                params.push(value)
            else
                params.push(new Param(value as ParamValue))
        }
        return params
    }

}

export class InsertOne<C extends Column[], Returning extends Column[]>
    extends Query<Returning> {

    private _values: Param[]

    constructor(
        readonly table: Table,
        readonly insertColumns: C,
        returning: Returning,
        values: Insert.Values<C>
    ) {
        super(returning)
        this._values = Insert.parseColumns(insertColumns, values)
    }

    override visit(visitor: Visitor): void {
        for (const column of this.insertColumns)
            column.visit(visitor)

        for (const value of this._values)
            value.visit(visitor)

        for (const column of this.columns)
            column.visit(visitor)
    }

    string(): string {
        const insertColumns = this.insertColumns.map(column => column.definition()).join(', ')

        const values = this._values.map(value => value.string()).join(', ')

        let sql = `INSERT INTO ${Table.name(this.table)} (${insertColumns}) VALUES (${values})`

        if (this.columns.length > 0) {
            const returning = this.columns.map(column => column.string()).join(', ')
            sql += ` RETURNING ${returning}`
        }

        return sql
    }

    returning<R extends Column[]>(...columns: R): InsertOne<C, R> {
        this.columns = columns as any
        return this as any as InsertOne<C, R>
    }

}

export class InsertMultiple<C extends Column[]>
    extends Query<[]> {

    private _values: Param[][]

    constructor(
        readonly table: Table,
        readonly insertColumns: C,
        values: Insert.Values<C>[]
    ) {
        super([])
        this._values = values.map(values => Insert.parseColumns(insertColumns, values))
    }

    override visit(visitor: Visitor): void {
        for (const column of this.insertColumns)
            column.visit(visitor)

        for (const values of this._values)
            for (const value of values)
                value.visit(visitor)
    }

    string(): string {
        const insertColumns = this.insertColumns.map(column => column.string()).join(', ')

        const values = this._values.map(values => {
            return '(' + values.map(value => value.string()).join(', ') + ')'
        }).join(', ')

        let sql = `INSERT INTO ${Table.name(this.table)} (${insertColumns}) VALUES ${values}`

        return sql
    }

}