import { StateHandler } from "./StateHandler";
import { StateMachineDescription } from "./StateMachineDescription";
import { StateMachine } from "./StateMachine";
type StateOf<D extends StateMachineDescription> = D["state"];
type DataOf<D extends StateMachineDescription> = D["data"];
type BuildResult<Description extends StateMachineDescription, S, D, R> = S extends true ? D extends true ? [
    R
] extends [never] ? StateMachine<Description> : void : void : void;
export interface StateMachineBuidler<Description extends StateMachineDescription, S, D, R> {
    state(state: StateOf<Description>): StateMachineBuidler<Description, true, D, R>;
    data(data: DataOf<Description>): StateMachineBuidler<Description, S, true, R>;
    handle<State extends StateOf<Description>>(state: State, handler: Partial<StateHandler<Description>>): StateMachineBuidler<Description, S, true, Exclude<R, State>>;
    build(): BuildResult<Description, S, D, R>;
}
export declare namespace StateMachineBuilder {
    function create<D extends StateMachineDescription>(): StateMachineBuidler<D, false, false, StateOf<D>>;
}
export {};
