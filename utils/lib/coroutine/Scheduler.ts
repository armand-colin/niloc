import { Coroutine, CoroutineIterator } from "./Coroutine";

export class Scheduler {

    private _coroutines: Coroutine[] = []

    constructor() { }

    add(coroutine: CoroutineIterator): Coroutine {
        const coroutineInstance = new Coroutine(coroutine)
        this._coroutines.push(coroutineInstance)
        this._handle(coroutineInstance)
        return coroutineInstance
    }

    private _handle(coroutine: Coroutine) {
        const next = coroutine.next()

        if (next.done) {
            const index = this._coroutines.indexOf(coroutine)
            if (index !== -1)
                this._coroutines.splice(index, 1)

            return
        }

        const schedule = next.value
        schedule.next(() => this._handle(coroutine))
    }

}