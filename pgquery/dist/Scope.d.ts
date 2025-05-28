import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { Visitor } from "./Visitor";
export declare class Scope<S extends Statement> extends Statement<Scope.ToString<S>> {
    readonly statement: S;
    constructor(statement: S);
    visit(visitor: Visitor): void;
    string(): Scope.ToString<S>;
}
export declare namespace Scope {
    type ToString<S extends Statement> = `(${Expression.ToString<S>})`;
}
