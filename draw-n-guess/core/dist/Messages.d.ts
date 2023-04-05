import { Machine } from "./Machine";
export declare enum MessageType {
    MachineSync = 0,
    MachineRequest = 1,
    MachineEvent = 2
}
export type Messages = {
    type: MessageType.MachineSync;
    state: Machine.State;
    data: Machine.Data;
} | {
    type: MessageType.MachineRequest;
} | {
    type: MessageType.MachineEvent;
    event: Machine.Event;
};
