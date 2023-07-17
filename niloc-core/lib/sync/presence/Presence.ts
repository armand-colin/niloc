import { Authority } from "../Authority";
import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { Model } from "../Model";
import { SyncObject } from "../SyncObject";
import { Template } from "../Template";
import { Factory } from "../Template";
import { Emitter } from "@niloc/utils";
import { ConnectionList } from "./ConnectionList";
import { Address } from "../../core/Address";

export type PresenceEvents<T extends SyncObject> = {
    usersChanged: T[]
}

type Options<T extends SyncObject> = {
    context: Context,
    channel: Channel<any>,
    factory: Factory<T>,
    connectionList: ConnectionList
}

export class Presence<T extends SyncObject> {

    private _connectionList: ConnectionList
    private _model: Model
    private _emitter = new Emitter<PresenceEvents<T>>()

    private _user: T
    private _users = [] as T[]

    constructor(options: Options<T>) {
        this._connectionList = options.connectionList

        this._model = new Model({
            channel: options.channel,
            context: options.context
        })

        const userTemplate = Template.create("user", options.factory, Authority.own())

        this._model.register(userTemplate)

        this._user = this._model.instantiate(userTemplate, options.context.userId)

        options.connectionList.emitter().on('connected', this._onConnected)
        options.connectionList.emitter().on('disconnected', this._onDisconnected)
        options.connectionList.emitter().on('sync', this._onSync)

        this._model.emitter().on('created', user => this._onUserCreated(user as T))
    }

    user(): T {
        return this._user
    }

    users(): T[] {
        return [...this._users]
    }

    emitter(): Emitter<PresenceEvents<T>> {
        return this._emitter
    }

    /*
     * Has to be called whenever the user or the presence map has changed
    */
    tick() {
        this._model.tick()
    }


    private _onUserCreated = (user: T) => {
        const isConnected = this._connectionList.isConnected(user.id())
        if (isConnected && !this._users.includes(user)) {
            this._users.push(user)
            this._emitter.emit('usersChanged', this.users())
        }
    }

    private _onConnected = (userId: string) => {
        if (userId === this._user.id())
            return
        
        this._model.syncTo(Address.to(userId))

        if (this._users.some(user => user.id() === userId))
            return

        const user = this._model.get<T>(userId)

        if (user) {
            this._users.push(user)
            this._emitter.emit('usersChanged', this.users())
        }
    }

    private _onDisconnected = (userId: string) => {
        if (userId === this._user.id())
            return
        
        const index = this._users.findIndex(user => user.id() === userId)
        if (index < 0)
            return
        
        this._users.splice(index, 1)
        this._emitter.emit('usersChanged', this.users())
    }

    private _onSync = () => {
        this._model.syncTo(Address.broadcast())
    }

}