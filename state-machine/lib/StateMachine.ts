import { Emitter } from "./Emitter"
import { StateMachineDescription } from "./StateMachineDescription"
import { StateHandler } from "./StateHandler"
import { StateMachineHandle } from "./StateMachineHandle"

type StateOf<D extends StateMachineDescription> = D["state"]
type DataOf<D extends StateMachineDescription> = D["data"]
type EventOf<D extends StateMachineDescription> = D["event"]

interface StateMachineEvents<D extends StateMachineDescription> {

    state: StateOf<D>
    data: DataOf<D>

}

export interface StateMachine<D extends StateMachineDescription> {

    state(): StateOf<D>
    data(): DataOf<D>
    event(event: EventOf<D>): void
    emitter(): Emitter<StateMachineEvents<D>>

}

export class StateMachine<D extends StateMachineDescription> implements StateMachine<D>, StateMachineHandle<D> {

    private _state: StateOf<D>
    private _data: DataOf<D>
    private _handlers: Record<StateOf<D>, StateHandler<D>>
    private _emitter = new Emitter<StateMachineEvents<D>>()

    constructor(initState: StateOf<D>, initData: DataOf<D>, handlers: Record<StateOf<D>, StateHandler<D>>) {
        this._state = initState
        this._data = initData
        this._handlers = handlers
    }

    state() { return this._state }
    data() { return { ...this._data } }
    emitter() { return this._emitter }

    event(event: EventOf<D>) { 
        this._handlers[this._state].onEvent(event, this.data(), this)
    }

    transition(state: StateOf<D>) {
        if (this._state !== undefined)
            this._handlers[this._state].onLeave()
        
        this._state = state

        this._handlers[state].onEnter(this.data(), this)
        this._emitter.emit('state', this.state())
    }

    setData(data: Partial<DataOf<D>>): DataOf<D> {
        this._data = {...this._data, ...data }
        this._emitter.emit('data', this.data())
        return this._data
    }

}