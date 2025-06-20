import { Column } from "./Column";
import { Expression } from "./Expression";
import { Table } from "./Table";
import { Visitor } from "./Visitor";
export declare class Join<T extends Table = Table, A extends Column = Column, B extends Column = Column> implements Expression<Join.ToString<Table, A, B>> {
    readonly table: T;
    readonly a: A;
    readonly b: B;
    constructor(table: T, a: A, b: B);
    visit(visitor: Visitor): void;
    string(): Join.ToString<T, A, B>;
}
declare namespace Join {
    type ToString<T extends Table, A extends Column, B extends Column> = T extends Table<infer TableName> ? `JOIN ${TableName} ON ${Expression.ToString<A>} = ${Expression.ToString<B>}` : ``;
}
export {};
