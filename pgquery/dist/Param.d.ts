import { Expression } from "./Expression";
import { ParamValue } from "./ParamValue";
import { Visitor } from "./Visitor";
export type ParamLike<T extends ParamValue = ParamValue> = T | Param<T>;
export declare class Param<T extends ParamValue = ParamValue> implements Expression<Param.ToString<T>> {
    readonly value: T;
    index: number;
    constructor(value: T);
    string(): Param.ToString<T>;
    visit(visitor: Visitor): void;
}
export declare namespace Param {
    type TypeToString<T extends ParamValue> = T extends string ? T : T extends Date ? "Date" : T extends number ? `${T}` : 'arg';
    export type ToString<T extends ParamValue> = `\${${TypeToString<T>}}`;
    export function from<T extends ParamValue>(param: ParamLike<T>): Param<T>;
    export {};
}
