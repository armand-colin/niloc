import { Column } from "./Column";
import { Expression } from "./Expression";
import { Table } from "./Table";
import { Visitor } from "./Visitor";

export class Join<
    T extends Table = Table,
    A extends Column = Column,
    B extends Column = Column
> implements Expression<Join.ToString<Table, A, B>> {

    constructor(readonly table: T, readonly a: A, readonly b: B) { }

    visit(visitor: Visitor): void {
        this.a.visit(visitor)
        this.b.visit(visitor)
    }

    string(): Join.ToString<T, A, B> {
        return `JOIN ${Table.name(this.table)} ON ${this.a.string()} = ${this.b.string()}` as Join.ToString<T, A, B>
    }

}

namespace Join {
    export type ToString<T extends Table, A extends Column, B extends Column> =
        T extends Table<infer TableName> ?
        `JOIN ${TableName} ON ${Expression.ToString<A>} = ${Expression.ToString<B>}` :
        ``
}