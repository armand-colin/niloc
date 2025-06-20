import { Column } from "./Column";
import { ColumnType } from "./ColumnType";
export interface Query<T extends Column[] = Column[]> {
    [Query.__columns]: T;
}
export declare namespace Query {
    const __columns: unique symbol;
    type Result<Q extends Query> = Q extends Query<infer T> ? Simplify<ReduceColumns<T>> : never;
}
type ReduceColumns<C extends Column[]> = C extends [infer First, ...infer Rest] ? First extends Column<infer Name, string, infer Type> ? Rest extends Column[] ? Record<Name, ColumnType.Type<Type>> & ReduceColumns<Rest> : Record<Name, ColumnType.Type<Type>> : {} : {};
type Simplify<T> = {
    [K in keyof T]: T[K];
};
export {};
