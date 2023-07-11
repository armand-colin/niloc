import { Address, Model, Router } from "@niloc/core";
import { User } from "./User";
import { Accessor, Setter, createSignal } from "solid-js";
import { faker } from "@faker-js/faker"

export class Presence {

    private _model: Model

    private _user: User

    private _usersSignal: [Accessor<User[]>, Setter<User[]>]
    private _users: User[] = []

    constructor(router: Router) {
        this._model = new Model({
            channel: router.channel(0),
            context: router.context()
        })

        this._model.register(User.template)

        this._user = this._model.instantiate(User.template, router.id())
        this._user.name.set(faker.internet.userName())
        this._user.color.set(faker.internet.color())

        this._model.emitter().on('created', object => {
            if (object instanceof User && object.id() !== this._user.id())
                this._addUser(object)
        })

        this._model.tick()

        this._usersSignal = createSignal<User[]>([])
    }

    sync(targetId?: string) {
        const address = targetId === undefined ? 
            Address.broadcast() : 
            Address.to(targetId)

        this._model.syncTo(address)
    }

    tick() {
        this._model.tick()
    }

    get user() {
        return this._user
    }

    useUsers(): Accessor<User[]> {
        return this._usersSignal[0]
    }

    private _addUser(user: User) {
        this._users.push(user)
        this._usersSignal[1]([...this._users])
    }

}