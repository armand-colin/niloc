import { Column } from "./Column";
import { ColumnType } from "./ColumnType";
export type Table<N extends string = string, T extends ColumnsDescriptor = ColumnsDescriptor> = {
    [Table.__name]: N;
} & Columns<T, N>;
type Columns<C extends ColumnsDescriptor, TableName extends string> = {
    [K in keyof C]: K extends string ? Column<K, TableName, C[K], Column.ToString<K, TableName>, Column.ToString<K, TableName>> : never;
};
type ColumnsDescriptor = Record<string, ColumnType>;
export declare namespace Table {
    const __name: unique symbol;
    type NameOf<T extends Table> = T extends Table<infer Name> ? Name : ``;
    function name<N extends string>(table: Table<N>): N;
    function create<T extends ColumnsDescriptor, N extends string>(name: N, columns: T): Table<N, T>;
}
export {};
