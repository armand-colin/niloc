import { any } from "./any"
import { boolean } from "./boolean"
import { custom } from "./custom"
import { integer } from "./integer"
import { number } from "./number"
import { string } from "./string"
import { syncObject } from "./syncObject"
import { syncObjectRef } from "./syncObjectRef"

export const field = {
    any,
    custom,
    boolean,
    number,
    /**
     * Equivalent of `field.number` decorator
     */
    float: number,
    integer,
    string,
    syncObject,
    syncObjectRef
}