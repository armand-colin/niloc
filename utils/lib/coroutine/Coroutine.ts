import { nanoid } from "nanoid"
import { ScheduleInterface } from "./Schedule"

export type CoroutineIterator = Iterator<ScheduleInterface>

export interface CoroutineInterface {
    readonly id: string
    readonly finished: boolean
    next(): IteratorResult<ScheduleInterface>
    cancel(): void
}

export class Coroutine implements CoroutineInterface {

    readonly id = nanoid()

    private _iterator: CoroutineIterator
    private _finished: boolean = false

    constructor(iterator: CoroutineIterator) {
        this._iterator = iterator
    }

    get finished() {
        return this._finished
    }

    next(): IteratorResult<ScheduleInterface> {
        const next = this._iterator.next()
        if (next.done) 
            this._finished = true
        
        return next
    }

    cancel() {
        this._iterator.return?.()
        this._finished = true
    }

}