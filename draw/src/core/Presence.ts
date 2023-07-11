import { Address, Model, Router } from "@niloc/core";
import { User } from "./User";
import { Accessor, Setter, createSignal } from "solid-js";

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

        this._user = this._model.instantiate(User.template)

        this._model.tick()

        this._model.emitter().on('created', object => {
            if (object instanceof User && object.id() !== this._user.id())
                this._addUser(object)
        })

        this._usersSignal = createSignal<User[]>([])
    }

    sync() {
        this._model.syncTo(Address.broadcast())
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