import { Column } from "./Column";
import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { Visitor } from "./Visitor";

export class In<C extends Column, E extends Expression> extends Statement<In.ToString<C, E>> {

    constructor(
        readonly column: C,
        readonly set: E
    ) {
        super()
    }

    visit(visitor: Visitor): void {
        this.column.visit(visitor)
        this.set.visit(visitor)
    }

    string(): In.ToString<C, E> {
        return `${this.column.string()} IN (${this.set.string()})` as In.ToString<C, E>
    }

}

export namespace In {

    export type ToString<C extends Column, E extends Expression> = `${Expression.ToString<C>} IN (${Expression.ToString<E>})`

}
