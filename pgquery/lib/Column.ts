import { ColumnType } from "./ColumnType"
import { Equals } from "./operators/Equals"
import { Expression } from "./Expression"
import { Like } from "./Like"
import { Param, ParamLike } from "./Param"
import { Table } from "./Table"
import { Visitor } from "./Visitor"
import { In } from "./In"
import type { Select } from "./Select"
import { Collection } from "./Collection"

export class Column<
    Name extends string = string,
    TableName extends string = string,
    Type extends ColumnType = ColumnType,
    ToString extends string = string,
    Definition extends string = string,
>
    implements Expression<ToString> {

    constructor(
        readonly table: Table<TableName>,
        readonly name: Name,
        readonly type: Type
    ) { }

    definition(): Definition {
        return this.string() as unknown as Definition
    }

    equals<Other extends Column<string, string, Type>>(other: Other): Equals<this, Other>
    equals<Value extends ColumnType.Type<Type>>(other: Value): Equals<this, Param<Value>>
    equals(other: Column<string, string, Type> | ColumnType.Type<Type>) {
        const value = other instanceof Column ?
            other :
            new Param(other)

        return new Equals(this, value)
    }

    string(): ToString {
        return `${Table.name(this.table)}.${this.name}` as ToString
    }

    visit(_visitor: Visitor): void { }

    like(value: ParamLike<string | number>): Expression {
        if (!(value instanceof Param))
            value = new Param(value)

        return new Like(this, value)
    }

    as<Name extends string>(name: Name) {
        return new Alias(name, this)
    }

    in<S extends Select>(select: S): In<this, S>
    in<V extends ParamLike<ColumnType.Type<Type>>[]>(values: V): In<this, Collection<ColumnType.Type<Type>>>
    in<S extends Select | ParamLike<ColumnType.Type<Type>>[]>(set: S) {
        if (Array.isArray(set))
            return new In(this, new Collection(set))

        return new In(this, set)
    }

}

export class Alias<
    Name extends string,
    ColumnClass extends Column,
> extends
    Column<
        Name,
        Column.TableNameOf<ColumnClass>,
        Column.TypeOf<ColumnClass>,
        Name,
        Alias.Definition<Name, Column.DefinitionOf<ColumnClass>>
    > {

    private _column: ColumnClass

    constructor(name: Name, column: ColumnClass) {
        super(
            column.table as Table<Column.TableNameOf<ColumnClass>>,
            name,
            column.type as Column.TypeOf<ColumnClass>
        )

        this._column = column
    }

    override definition(): Alias.Definition<Name, Column.DefinitionOf<ColumnClass>> {
        return `${this._column.definition()} AS ${this.name}` as Alias.Definition<Name, Column.DefinitionOf<ColumnClass>>
    }

    override string(): Name {
        return this.name
    }

    override visit(visitor: Visitor): void {
        this._column.visit(visitor)
    }

}

export namespace Column {

    export type ToString<Name extends string, TableName extends string> = `${TableName}.${Name}`

    export type TableNameOf<C extends Column> = C extends Column<string, infer TableName> ? TableName : string
    export type TypeOf<C extends Column> = C extends Column<string, string, infer Type> ? Type : never
    export type ToStringOf<C extends Column> = C extends Column<string, string, ColumnType, infer ToString> ? ToString : ``
    export type DefinitionOf<C extends Column> = C extends Column<string, string, ColumnType, string, infer Definition> ? Definition : ``

}

export namespace Alias {

    export type Definition<Name extends string, BaseDefinition extends string> = `${BaseDefinition} AS ${Name}`

}