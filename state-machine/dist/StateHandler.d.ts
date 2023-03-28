import { StateMachineDescription } from "./StateMachineDescription";
import { StateMachineHandle } from "./StateMachineHandle";
type DataOf<D extends StateMachineDescription> = D["data"];
type EventOf<D extends StateMachineDescription> = D["event"];
export interface StateHandler<D extends StateMachineDescription> {
    onEnter(data: DataOf<D>, handle: StateMachineHandle<D>): void;
    onEvent(event: EventOf<D>, data: DataOf<D>, handle: StateMachineHandle<D>): void;
    onLeave(): void;
}
export {};
