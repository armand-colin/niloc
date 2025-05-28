import { Statement } from "../Statement";
import { InfixOperator } from "./InfixOperator";

export class And<A extends Statement, B extends Statement> extends InfixOperator<A, B, "AND"> {

    constructor(a: A, b: B) {
        super(a, b, "AND")
    }

}