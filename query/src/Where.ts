import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { Visitor } from "./Visitor";

export class Where<S extends Statement = Statement> implements Expression<Where.ToString<S>> {
    
    constructor(readonly statement: S) { }

    string(): Where.ToString<S> {
        return `WHERE ${this.statement.string()}` as Where.ToString<S>
    }

    visit(visitor: Visitor): void {
        this.statement.visit(visitor)
    }

}

export namespace Where {
    export type ToString<S extends Statement> = `WHERE ${Expression.ToString<S>}`
}