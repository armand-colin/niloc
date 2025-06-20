import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { Visitor } from "./Visitor";
export declare class Where<S extends Statement = Statement> implements Expression<Where.ToString<S>> {
    readonly statement: S;
    constructor(statement: S);
    string(): Where.ToString<S>;
    visit(visitor: Visitor): void;
}
export declare namespace Where {
    type ToString<S extends Statement> = `WHERE ${Expression.ToString<S>}`;
}
