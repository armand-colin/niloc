import { Statement } from "../Statement";
import { InfixOperator } from "./InfixOperator";
export declare class And<A extends Statement, B extends Statement> extends InfixOperator<A, B, "AND"> {
    constructor(a: A, b: B);
}
