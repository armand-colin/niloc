import { Expression } from "../Expression";
import { InfixOperator } from "./InfixOperator";

export class Equals<A extends Expression, B extends Expression> extends InfixOperator<A, B, "="> {

    constructor(a: A, b: B) {
        super(a, b, "=")
    }

}