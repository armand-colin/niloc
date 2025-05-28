import { Expression } from "../Expression";
import { Statement } from "../Statement";
import { Visitor } from "../Visitor";
export declare class InfixOperator<A extends Expression, B extends Expression, Op extends string> extends Statement<InfixOperator.ToString<A, B, Op>> {
    readonly a: A;
    readonly b: B;
    readonly op: Op;
    constructor(a: A, b: B, op: Op);
    string(): InfixOperator.ToString<A, B, Op>;
    visit(visitor: Visitor): void;
}
declare namespace InfixOperator {
    type ToString<A extends Expression, B extends Expression, Op extends string> = `${Expression.ToString<A>} ${Op} ${Expression.ToString<B>}`;
}
export {};
