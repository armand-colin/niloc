type State = string | number

export interface StateMachineDescription {
    state: State,
    data: any,
    event: any
}