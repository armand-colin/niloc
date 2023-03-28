import { StateMachineDescription } from "./StateMachineDescription";
type StateOf<D extends StateMachineDescription> = D["state"];
type DataOf<D extends StateMachineDescription> = D["data"];
export interface StateMachineHandle<D extends StateMachineDescription> {
    transition(state: StateOf<D>): void;
    setData(data: Partial<DataOf<D>>): DataOf<D>;
}
export {};
