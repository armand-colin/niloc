import { Accessor, Signal, createSignal } from "solid-js";
import { User } from "./User";
import { ConnectionList, Presence as CorePresence, Router } from "@niloc/core";
import { faker } from "@faker-js/faker";
import { Channels } from "./Channels";
export class Presence extends CorePresence<User> {

    private _usersSignal: Signal<User[]>

    private _frequency = 20

    constructor(router: Router, connectionList: ConnectionList) {
        super({
            channel: router.channel(Channels.Presence),
            context: router.context(),
            factory: User,
            connectionList
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

    private _tickRequest: { timeout: number | null, time: number } = { timeout: null, time: 0 } 
    tick(): void {
        if (this._tickRequest.timeout !== null)
            return
        
        const now = Date.now()
        const elapsed = now - this._tickRequest.time
        if (elapsed < this._frequency)
            return
        
        this._tickRequest.time = now
        this._tickRequest.timeout = setTimeout(() => {
            this._tickRequest.timeout = null
            this._tickRequest.time = 0
            super.tick()
        }, this._frequency)
    }

}