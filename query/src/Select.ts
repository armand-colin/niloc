import { Column } from "./Column"
import { Expression } from "./Expression"
import { Join } from "./Join"
import { Param, ParamLike } from "./Param"
import { Query } from "./QueryClass"
import { Statement } from "./Statement"
import { Table } from "./Table"
import { Visitor } from "./Visitor"
import { Where } from "./Where"

type Joining<T extends Table, D extends SelectData> = {
    on<A extends Column, B extends Column>(a: A, b: B): Select<Omit<D, "joins"> & { joins: [...D["joins"], Join<T, A, B>] }>
}

type SelectData = {
    columns: Column[],
    table: Table,
    joins: Join[],
    where: Where | null
}

export class Select<D extends SelectData = SelectData>
    extends Statement<Select.ToString<D>>
    implements Query<D["columns"]> {

    [Query.__columns]: D["columns"]

    private _orderBy: { column: Column, order: "ASC" | "DESC" } | null = null
    private _offset: Param<number> | null = null
    private _limit: Param<number> | null = null

    constructor(readonly data: D) {
        super()
        this[Query.__columns] = data.columns
    }

    string(): Select.ToString<D> {
        const columns = this[Query.__columns].map(column => column.definition()).join(', ')

        let sql = `SELECT ${columns} FROM ${Table.name(this.data.table)}`

        for (const join of this.data.joins)
            sql += '\n' + join.string()

        if (this.data.where)
            sql += '\n' + this.data.where.string()

        if (this._orderBy)
            sql += `\nORDER BY ${this._orderBy.column.string()} ${this._orderBy.order}`

        if (this._limit)
            sql += `\nLIMIT ${this._limit.string()}`

        if (this._offset)
            sql += `\nOFFSET ${this._offset.string()}`

        return sql as Select.ToString<D>
    }

    visit(visitor: Visitor) {
        for (const join of this.data.joins)
            join.visit(visitor)

        if (this.data.where)
            this.data.where.visit(visitor)

        if (this._orderBy)
            this._orderBy.column.visit(visitor)

        if (this._offset instanceof Param)
            this._offset.visit(visitor)

        if (this._limit instanceof Param)
            this._limit.visit(visitor)
    }

    join<T extends Table>(table: T): Joining<T, D> {
        return {
            on: <A extends Column, B extends Column>(a: A, b: B) => {
                return new Select({
                    ...this.data,
                    joins: [...this.data.joins, new Join(table, a, b)]
                }) as any
            }
        }
    }

    where<S extends Statement>(statement: S): Select<Omit<D, "where"> & { where: Where<S> }> {
        return new Select({
            ...this.data,
            where: new Where(statement)
        })
    }

    orderBy(column: Column) {
        this._orderBy = { column, order: "ASC" }
        return this
    }

    orderByDesc(column: Column) {
        this._orderBy = { column, order: "DESC" }
        return this
    }

    limit(limit: ParamLike<number>) {
        this._limit = Param.from(limit)
        return this
    }

    offset(offset: ParamLike<number>) {
        this._offset = Param.from(offset)
        return this
    }

}

export namespace Select {

    type JoinString<T extends string[], Sep extends string, IsFirst = true> =
        T extends [infer First, ...infer Rest] ?
        First extends string ?
        Rest extends string[] ?
        IsFirst extends true ?
        `${First}${JoinString<Rest, Sep, false>}` :
        `${Sep}${First}${JoinString<Rest, Sep, false>}` :
        `` :
        `` :
        ``

    type ColumnsStringMap<C extends Column[]> = C extends [infer First, ...infer Rest] ?
        First extends Column ?
        Rest extends Column[] ?
        [Column.DefinitionOf<First>, ...ColumnsStringMap<Rest>] :
        [] :
        [] :
        []

    type ColumnsString<C extends Column[]> = JoinString<ColumnsStringMap<C>, ", ">

    type JoinsStringMap<J extends Join[]> = J extends [infer First, ...infer Rest] ?
        First extends Join ?
        Rest extends Join[] ?
        [Expression.ToString<First>, ...JoinsStringMap<Rest>] :
        [] :
        [] :
        []

    type WhereString<W extends Where | null> = W extends Where<infer S> ?
        Where.ToString<S> :
        ''

    export type ToString<D extends SelectData> =
        `SELECT ${ColumnsString<D["columns"]>} FROM ${Table.NameOf<D["table"]>}
${JoinString<JoinsStringMap<D["joins"]>, "\n">}
${WhereString<D["where"]>}`

}