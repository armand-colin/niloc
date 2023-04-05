export declare namespace Machine {
    type Player = {
        id: string;
        name: string;
    };
    type Options = {};
    type State = "init";
    type Data = {
        leader: string | null;
        players: Player[];
        options: Options | null;
    };
    type Event = {
        type: "join";
        playerId: string;
        name: string;
    } | {
        type: "start";
        playerId: string;
        options: Options;
    };
    type Description = {
        state: State;
        data: Data;
        event: Event;
    };
}
