import { Expression } from "./Expression"
import { ParamValue } from "./ParamValue"
import { Visitor } from "./Visitor"

export type ParamLike<T extends ParamValue = ParamValue> = T | Param<T>

export class Param<T extends ParamValue = ParamValue> implements Expression<Param.ToString<T>> {

    index = 0

    constructor(readonly value: T) { }

    string(): Param.ToString<T> {
        return ('$' + this.index) as Param.ToString<T>
    }

    visit(visitor: Visitor): void {
        if (this.index > 0)
            return

        this.index = visitor.index
        visitor.index++
        visitor.params.push(this.value)
    }

}

export namespace Param {

    type TypeToString<T extends ParamValue> = T extends string ? T : T extends Date ? "Date" : T extends number ? `${T}` : 'arg'

    export type ToString<T extends ParamValue> = `\${${TypeToString<T>}}`

    export function from<T extends ParamValue>(param: ParamLike<T>): Param<T> {
        if (param instanceof Param)
            return param

        return new Param(param)
    }
}