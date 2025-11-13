import { Coroutine, CoroutineIterator, Emitter } from "@niloc/utils"
import { nanoid } from "nanoid"
import type { Engine } from "./Engine"

type Events = {
    change: void
}

export class Component {

    readonly id = nanoid()

    private _coroutines: Coroutine[] = []
    private _emitter = new Emitter<Events>()

    constructor(protected readonly engine: Engine) { }

    onChange(listener: () => void) {
        return this._emitter.on('change', listener)
    }

    offChange(listener: () => void) {
        this._emitter.off('change', listener)
    }
    
    protected changed() {
        this._emitter.emit('change')
    }

    protected startCoroutine(coroutine: CoroutineIterator): Coroutine {
        const coroutineInstance = this.engine.scheduler.add(coroutine)
        this._coroutines.push(coroutineInstance)
        return coroutineInstance
    }
    
    destroy() {
        for (const coroutine of this._coroutines)
            coroutine.cancel()
        this._coroutines = []

        this._emitter.removeAllListeners()
    }

}