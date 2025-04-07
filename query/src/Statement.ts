import { Expression } from "./Expression"
import { And } from "./operators/And"
import { Or } from "./operators/Or"
import { Visitor } from "./Visitor"

const __symbol = Symbol("Statement.symbol")

export abstract class Statement<ToString extends string = string> implements Expression<ToString> {
    
    readonly [__symbol] = true

    abstract visit(_visitor: Visitor): void 
    abstract string(): ToString

    or<S extends Statement>(other: S): Or<this, S> {
        return new Or(this, other)
    }

    and<S extends Statement>(other: S): And<this, S> {
        return new And(this, other)
    }

}