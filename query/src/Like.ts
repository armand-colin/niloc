import { Column } from "./Column"
import { Expression } from "./Expression"
import { Param } from "./Param"
import { Visitor } from "./Visitor"

export class Like implements Expression {

    constructor(readonly column: Column, readonly value: Param) { }

    visit(visitor: Visitor): void {
        this.column.visit(visitor)
        this.value.visit(visitor)
    }

    string() {
        return `${this.column.string()} LIKE % | ${this.value.string()} | %`
    }

}