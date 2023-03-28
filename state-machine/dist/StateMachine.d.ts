import { Emitter } from "./Emitter";
import { StateMachineDescription } from "./StateMachineDescription";
import { StateHandler } from "./StateHandler";
import { StateMachineHandle } from "./StateMachineHandle";
type StateOf<D extends StateMachineDescription> = D["state"];
type DataOf<D extends StateMachineDescription> = D["data"];
type EventOf<D extends StateMachineDescription> = D["event"];
interface StateMachineEvents<D extends StateMachineDescription> {
    state: StateOf<D>;
    data: DataOf<D>;
}
export interface StateMachine<D extends StateMachineDescription> {
    state(): StateOf<D>;
    data(): DataOf<D>;
    event(event: EventOf<D>): void;
    emitter(): Emitter<StateMachineEvents<D>>;
}
export declare class StateMachine<D extends StateMachineDescription> implements StateMachine<D>, StateMachineHandle<D> {
    private _state;
    private _data;
    private _handlers;
    private _emitter;
    constructor(initState: StateOf<D>, initData: DataOf<D>, handlers: Record<StateOf<D>, StateHandler<D>>);
    transition(state: StateOf<D>): void;
    setData(data: Partial<DataOf<D>>): DataOf<D>;
}
export {};
