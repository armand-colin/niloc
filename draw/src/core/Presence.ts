import { Accessor, Signal, createSignal } from "solid-js";
import { User } from "./User";
import { Channel, Context, Presence as CorePresence } from "@niloc/core";
import { faker } from "@faker-js/faker";
export class Presence extends CorePresence<User> {

    private _usersSignal: Signal<User[]>

    constructor(context: Context, channel: Channel<any>) {
        super(context, channel, User)
        this._usersSignal = createSignal(this.users())
        
        this.emitter().on('usersChanged', () => {
            this._usersSignal[1](this.users())
        })
        
        Object.assign(window, { presence: this })

        this.user().name.set(faker.internet.displayName())
        this.user().color.set(faker.internet.color())
    }

    useUsers(): Accessor<User[]> {
        return this._usersSignal[0]
    }

}