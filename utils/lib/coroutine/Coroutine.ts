import { nanoid } from "nanoid"
import { Schedule } from "./Schedule"

export type CoroutineIterator = Iterator<Schedule>

export class Coroutine {

    readonly id = nanoid()

    private _iterator: CoroutineIterator

    constructor(iterator: CoroutineIterator) {
        this._iterator = iterator
    }

    next(): IteratorResult<Schedule> {
        return this._iterator.next()
    }

    cancel() {
        this._iterator.return?.()
    }

}