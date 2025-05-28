import { Expression } from "./Expression";
import { ParamLike } from "./Param";
import { ParamValue } from "./ParamValue";
import { Visitor } from "./Visitor";
export declare class Collection<T extends ParamValue> implements Expression<Collection.ToString<T>> {
    private _values;
    constructor(values: ParamLike<T>[]);
    visit(visitor: Visitor): void;
    string(): Collection.ToString<T>;
}
export declare namespace Collection {
    type ToString<_T extends ParamValue> = `?, ?, ?`;
}
