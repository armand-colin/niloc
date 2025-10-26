import type { Coroutine } from "./Coroutine";
import { Schedule } from "./Schedule";

export class Scheduler {

    private _coroutines: Record<Schedule, Coroutine[]> = {}

    constructor() { }

    add(coroutine: Coroutine) {
        this._handle(coroutine)
    }

    private _handle(coroutine: Coroutine) {
        const next = coroutine.next()
        if (next.done)
            return

        const coroutines = this._coroutines[next.value] ??= []
        coroutines.push(coroutine)
    }

    trigger(schedule: Schedule) {
        const coroutines = this._coroutines[schedule]
        if (!coroutines)
            return

        this._coroutines[schedule] = []

        for (const coroutine of coroutines)
            this._handle(coroutine)
    }

}