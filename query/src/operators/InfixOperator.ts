import { Expression } from "../Expression";
import { Statement } from "../Statement";
import { Visitor } from "../Visitor";

export class InfixOperator<A extends Expression, B extends Expression, Op extends string>
    extends Statement<InfixOperator.ToString<A, B, Op>> {

    constructor(readonly a: A, readonly b: B, readonly op: Op) {
        super()
    }

    override string(): InfixOperator.ToString<A, B, Op> {
        return `${this.a.string()} ${this.op} ${this.b.string()}` as InfixOperator.ToString<A, B, Op>
    }

    override visit(visitor: Visitor): void {
        this.a.visit(visitor)
        this.b.visit(visitor)
    }

}

namespace InfixOperator {

    export type ToString<
        A extends Expression,
        B extends Expression,
        Op extends string
    > = `${Expression.ToString<A>} ${Op} ${Expression.ToString<B>}`

}