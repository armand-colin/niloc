import { StateHandler } from "./StateHandler";
import { StateMachineDescription } from "./StateMachineDescription";
import { StateMachine } from "./StateMachine"

type StateOf<D extends StateMachineDescription> = D["state"]
type DataOf<D extends StateMachineDescription> = D["data"]

type BuildResult<Description extends StateMachineDescription, S, D, R> =
    S extends true ?
    D extends true ?
    [R] extends [never] ?
    StateMachine<Description> :
    void :
    void :
    void

export interface StateMachineBuidler<Description extends StateMachineDescription, S, D, R> {

    state(state: StateOf<Description>): StateMachineBuidler<Description, true, D, R>
    data(data: DataOf<Description>): StateMachineBuidler<Description, S, true, R>
    handle<State extends StateOf<Description>>(state: State, handler: Partial<StateHandler<Description>>): StateMachineBuidler<Description, S, true, Exclude<R, State>>
    build(): BuildResult<Description, S, D, R>

}

export namespace StateMachineBuilder {

    export function create<D extends StateMachineDescription>(): StateMachineBuidler<D, false, false, StateOf<D>> {
        const _handlers: Partial<Record<StateOf<D>, StateHandler<D>>> = {}
        let _state: any = null
        let _data: any = null

        return {

            state(state) { _state = state; return this as any },
            data(data) { _data = data; return this as any },
            handle(state, handler) { 
                if (!handler.onEnter)
                    handler.onEnter = () => {}
                if (!handler.onEvent)
                    handler.onEvent = () => {}
                if (!handler.onLeave)
                    handler.onLeave = () => {}

                _handlers[state] = handler as StateHandler<D>; return this as any 
            },
            build() { return new StateMachine(_state as any, _data, _handlers as any) as unknown as any },

        }
    }

}