export namespace Machine {

    export type Player = {
        id: string,
        name: string
    }

    export type Options = {

    }

    export type State = "init"

    export type Data = {
        leader: string | null,
        players: Player[],
        options: Options | null
    }

    export type Event =
        { type: "join", playerId: string, name: string } |
        { type: "start", playerId: string, options: Options }

    export type Description = {
        state: State,
        data: Data,
        event: Event
    }

}