import { Expression } from "./Expression";
import { Param, ParamLike } from "./Param";
import { ParamValue } from "./ParamValue";
import { Visitor } from "./Visitor";

export class Collection<T extends ParamValue> implements Expression<Collection.ToString<T>> {

    private _values: Param<T>[]

    constructor(values: ParamLike<T>[]) {
        this._values = values.map(value => Param.from(value))
    }

    visit(visitor: Visitor): void {
        for (const value of this._values)
            value.visit(visitor)
    }

    string(): Collection.ToString<T> {
        return this._values.map(value => value.string()).join(', ') as Collection.ToString<T>
    }

}

export namespace Collection {
    export type ToString<_T extends ParamValue> = `?, ?, ?`
}