import { Column } from "./Column";
import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { Visitor } from "./Visitor";
export declare class In<C extends Column, E extends Expression> extends Statement<In.ToString<C, E>> {
    readonly column: C;
    readonly set: E;
    constructor(column: C, set: E);
    visit(visitor: Visitor): void;
    string(): In.ToString<C, E>;
}
export declare namespace In {
    type ToString<C extends Column, E extends Expression> = `${Expression.ToString<C>} IN (${Expression.ToString<E>})`;
}
