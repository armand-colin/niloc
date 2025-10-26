import { nanoid } from "nanoid"
import { Schedule } from "./Schedule"
export class Coroutine {

    readonly id = nanoid()

    private _iterator: Iterator<Schedule>

    constructor(iterator: Iterator<Schedule>) {
        this._iterator = iterator
    }

    next(): IteratorResult<Schedule> {
        return this._iterator.next()
    }

    cancel() {
        this._iterator.return?.()
    }

}