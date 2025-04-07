import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { Visitor } from "./Visitor";

export class Scope<S extends Statement> extends Statement<Scope.ToString<S>> {

    constructor(readonly statement: S) {
        super()
    }

    visit(visitor: Visitor): void {
        this.statement.visit(visitor)
    }

    string(): Scope.ToString<S> {
        return `(${this.statement.string()})` as Scope.ToString<S>
    }

}

export namespace Scope {
    export type ToString<S extends Statement> = `(${Expression.ToString<S>})`
}