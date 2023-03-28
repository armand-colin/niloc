import { StateHandler, StateMachine, StateMachineBuilder } from "state-machine"
import { Machine } from "./Machine";

const init: Partial<StateHandler<Machine.Description>> = {
    onEvent(event, data, handle) {
        switch (event.type) {
            case "join": {
                const exists = data.players.find(player => player.id === event.playerId)
                if (exists)
                    return

                let leader = data.leader ?? event.playerId
                const players = [...data.players, { id: event.playerId, name: event.name }]

                handle.setData({ players, leader })
                break
            }
            case "start": {
                if (event.playerId !== data.leader)
                    return

                if (data.players.length < 2)
                    return

                break
            }
        }
    },
}

export function Implementation(): StateMachine<Machine.Description> {

    const machine = StateMachineBuilder.create<Machine.Description>()
        .state("init")
        .data({
            leader: null,
            players: [],
            options: null
        })
        .handle("init", init)
        .build()

    return machine

}