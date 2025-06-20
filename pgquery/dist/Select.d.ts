import { Column } from "./Column";
import { Expression } from "./Expression";
import { Join } from "./Join";
import { ParamLike } from "./Param";
import { Query } from "./QueryClass";
import { Statement } from "./Statement";
import { Table } from "./Table";
import { Visitor } from "./Visitor";
import { Where } from "./Where";
type Joining<T extends Table, D extends SelectData> = {
    on<A extends Column, B extends Column>(a: A, b: B): Select<Omit<D, "joins"> & {
        joins: [...D["joins"], Join<T, A, B>];
    }>;
};
type SelectData = {
    columns: Column[];
    table: Table;
    joins: Join[];
    where: Where | null;
};
export declare class Select<D extends SelectData = SelectData> extends Statement<Select.ToString<D>> implements Query<D["columns"]> {
    readonly data: D;
    [Query.__columns]: D["columns"];
    private _orderBy;
    private _offset;
    private _limit;
    constructor(data: D);
    string(): Select.ToString<D>;
    visit(visitor: Visitor): void;
    join<T extends Table>(table: T): Joining<T, D>;
    where<S extends Statement>(statement: S): Select<Omit<D, "where"> & {
        where: Where<S>;
    }>;
    orderBy(column: Column): this;
    orderByDesc(column: Column): this;
    limit(limit: ParamLike<number>): this;
    offset(offset: ParamLike<number>): this;
}
export declare namespace Select {
    type JoinString<T extends string[], Sep extends string, IsFirst = true> = T extends [infer First, ...infer Rest] ? First extends string ? Rest extends string[] ? IsFirst extends true ? `${First}${JoinString<Rest, Sep, false>}` : `${Sep}${First}${JoinString<Rest, Sep, false>}` : `` : `` : ``;
    type ColumnsStringMap<C extends Column[]> = C extends [infer First, ...infer Rest] ? First extends Column ? Rest extends Column[] ? [
        Column.DefinitionOf<First>,
        ...ColumnsStringMap<Rest>
    ] : [
    ] : [
    ] : [
    ];
    type ColumnsString<C extends Column[]> = JoinString<ColumnsStringMap<C>, ", ">;
    type JoinsStringMap<J extends Join[]> = J extends [infer First, ...infer Rest] ? First extends Join ? Rest extends Join[] ? [
        Expression.ToString<First>,
        ...JoinsStringMap<Rest>
    ] : [
    ] : [
    ] : [
    ];
    type WhereString<W extends Where | null> = W extends Where<infer S> ? Where.ToString<S> : '';
    export type ToString<D extends SelectData> = `SELECT ${ColumnsString<D["columns"]>} FROM ${Table.NameOf<D["table"]>}
${JoinString<JoinsStringMap<D["joins"]>, "\n">}
${WhereString<D["where"]>}`;
    export {};
}
export {};
