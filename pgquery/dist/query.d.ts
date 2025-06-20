import { Column } from "./Column";
import { ColumnType } from "./ColumnType";
import { Count } from "./Count";
import { And } from "./operators/And";
import { Or } from "./operators/Or";
import { Query } from "./QueryClass";
import { Select } from "./Select";
import { Statement } from "./Statement";
import { Table } from "./Table";
export declare namespace query {
    type result<T extends Query> = Query.Result<T>;
    function select<C extends Column[]>(...columns: C): {
        from<TableType extends Table>(table: TableType): Select<{
            joins: [];
            columns: C;
            table: TableType;
            where: null;
        }>;
    };
    function or<A extends Statement, B extends Statement>(a: A, b: B): Or<A, B>;
    function and<A extends Statement, B extends Statement>(a: A, b: B): And<A, B>;
    function count(column: Column): Count;
    const string: ColumnType<string, false>;
    const date: ColumnType<Date, false>;
    const number: ColumnType<number, false>;
}
