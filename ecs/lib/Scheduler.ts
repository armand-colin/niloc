import type { Coroutine } from "./Coroutine";

export class Scheduler {

    private _coroutines: Coroutine[] = []

    constructor() { }

    start(coroutine: Coroutine) {
        this._coroutines.push(coroutine)
        this._handle(coroutine)
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