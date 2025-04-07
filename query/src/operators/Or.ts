import { Statement } from "../Statement";
import { InfixOperator } from "./InfixOperator";

export class Or<A extends Statement, B extends Statement> extends InfixOperator<A, B, "OR"> {

    constructor(a: A, b: B) {
        super(a, b, "OR")
    }

}