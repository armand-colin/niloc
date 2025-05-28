import { Column } from "./Column";
import { Expression } from "./Expression";
import { Param } from "./Param";
import { Visitor } from "./Visitor";
export declare class Like implements Expression {
    readonly column: Column;
    readonly value: Param;
    constructor(column: Column, value: Param);
    visit(visitor: Visitor): void;
    string(): string;
}
