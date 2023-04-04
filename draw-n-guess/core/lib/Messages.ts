import { Machine } from "./Machine";

export enum MessageType {
    MachineSync,
    MachineRequest,
    MachineEvent
}

export type Messages = 
    { type: MessageType.MachineSync, state: Machine.State, data: Machine.Data } |
    { type: MessageType.MachineRequest } |
    { type: MessageType.MachineEvent, event: Machine.Event }