import { Expression } from "./Expression";
import { And } from "./operators/And";
import { Or } from "./operators/Or";
import { Visitor } from "./Visitor";
declare const __symbol: unique symbol;
export declare abstract class Statement<ToString extends string = string> implements Expression<ToString> {
    readonly [__symbol] = true;
    abstract visit(_visitor: Visitor): void;
    abstract string(): ToString;
    or<S extends Statement>(other: S): Or<this, S>;
    and<S extends Statement>(other: S): And<this, S>;
}
export {};
