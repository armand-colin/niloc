import { Column } from "./Column"
import { ColumnType } from "./ColumnType"

export type Table<
    N extends string = string,
    T extends ColumnsDescriptor = ColumnsDescriptor
> = {
    [Table.__name]: N
} & Columns<T, N>

type Columns<C extends ColumnsDescriptor, TableName extends string> = {
    [K in keyof C]: K extends string ? Column<
        K, 
        TableName, 
        C[K],
        Column.ToString<K, TableName>,
        Column.ToString<K, TableName>
    > : never
}

type ColumnsDescriptor = Record<string, ColumnType>


export namespace Table {

    export const __name = Symbol("Table.name")

    export type NameOf<T extends Table> = T extends Table<infer Name> ? Name : ``

    export function name<N extends string>(table: Table<N>): N {
        return table[__name]
    }

    export function create<T extends ColumnsDescriptor, N extends string>(name: N, columns: T): Table<N, T> {
        const table = {
            [__name]: name
        } as Partial<Table<N, T>>

        for (const key in columns) {
            const columnType = columns[key]
            const column = new Column(table as Table<N, T>, key, columnType)
            table[key] = column as any
        }

        return table as Table<N, T>
    }

}