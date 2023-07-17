import { Accessor, Signal, createSignal } from "solid-js";
import { User } from "./User";
import { ConnectionList, Presence as CorePresence, Router } from "@niloc/core";
import { faker } from "@faker-js/faker";
import { Channels } from "./Channels";
export class Presence extends CorePresence<User> {

    private _usersSignal: Signal<User[]>

    constructor(router: Router) {
        super({
            channel: router.channel(Channels.Presence),
            context: router.context(),
            factory: User,
            connectionList: ConnectionList.client(router.channel(Channels.ConnectionList))
        })

        this._usersSignal = createSignal(this.users())

        this.emitter().on('usersChanged', () => {
            this._usersSignal[1](this.users())
        })

        Object.assign(window, { presence: this })

        this.user().name.set(faker.animal.cat())
        this.user().color.set(faker.internet.color())
    }

    useUsers(): Accessor<User[]> {
        return this._usersSignal[0]
    }

}