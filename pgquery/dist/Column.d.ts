import { ColumnType } from "./ColumnType";
import { Equals } from "./operators/Equals";
import { Expression } from "./Expression";
import { Param, ParamLike } from "./Param";
import { Table } from "./Table";
import { Visitor } from "./Visitor";
import { In } from "./In";
import type { Select } from "./Select";
import { Collection } from "./Collection";
export declare class Column<Name extends string = string, TableName extends string = string, Type extends ColumnType = ColumnType, ToString extends string = string, Definition extends string = string> implements Expression<ToString> {
    readonly table: Table<TableName>;
    readonly name: Name;
    readonly type: Type;
    constructor(table: Table<TableName>, name: Name, type: Type);
    definition(): Definition;
    equals<Other extends Column<string, string, Type>>(other: Other): Equals<this, Other>;
    equals<Value extends ColumnType.Type<Type>>(other: Value): Equals<this, Param<Value>>;
    string(): ToString;
    visit(_visitor: Visitor): void;
    like(value: ParamLike<string | number>): Expression;
    as<Name extends string>(name: Name): Alias<Name, this>;
    in<S extends Select>(select: S): In<this, S>;
    in<V extends ParamLike<ColumnType.Type<Type>>[]>(values: V): In<this, Collection<ColumnType.Type<Type>>>;
}
export declare class Alias<Name extends string, ColumnClass extends Column> extends Column<Name, Column.TableNameOf<ColumnClass>, Column.TypeOf<ColumnClass>, Name, Alias.Definition<Name, Column.DefinitionOf<ColumnClass>>> {
    private _column;
    constructor(name: Name, column: ColumnClass);
    definition(): Alias.Definition<Name, Column.DefinitionOf<ColumnClass>>;
    string(): Name;
    visit(visitor: Visitor): void;
}
export declare namespace Column {
    type ToString<Name extends string, TableName extends string> = `${TableName}.${Name}`;
    type TableNameOf<C extends Column> = C extends Column<string, infer TableName> ? TableName : string;
    type TypeOf<C extends Column> = C extends Column<string, string, infer Type> ? Type : never;
    type ToStringOf<C extends Column> = C extends Column<string, string, ColumnType, infer ToString> ? ToString : ``;
    type DefinitionOf<C extends Column> = C extends Column<string, string, ColumnType, string, infer Definition> ? Definition : ``;
}
export declare namespace Alias {
    type Definition<Name extends string, BaseDefinition extends string> = `${BaseDefinition} AS ${Name}`;
}
