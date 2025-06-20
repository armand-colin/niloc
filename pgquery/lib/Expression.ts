import { Visitor } from "./Visitor";

export interface Expression<ToString extends string = string> {
    string(): ToString,
    visit(visitor: Visitor): void
}

export namespace Expression {

    export type ToString<T extends Expression> = T extends Expression<infer ToString> ? ToString : ``

}