import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { Model } from "../Model";
import { SyncObject } from "../SyncObject";
import { Emitter, IEmitter } from "@niloc/utils";
import { ConnectionList } from "./ConnectionList";
import { ConnectionPlugin } from "./ConnectionPlugin";
import { SyncObjectType } from "../SyncObjectType";
import { OwnerAuthorityPlugin } from "./OwnerAuthorityPlugin";

export type PresenceEvents<T extends SyncObject> = {
    changed: T[],
    connected: T,
    disconnected: string
}

type Options<T extends SyncObject> = {
    context: Context,
    channel: Channel<any>,
    type: SyncObjectType<T>,
    connectionList: ConnectionList
}

export class Presence<T extends SyncObject> {

    private _connectionList: ConnectionList
    private _model: Model
    private _emitter = new Emitter<PresenceEvents<T>>()

    private _user: T
    private _others = [] as T[]

    constructor(options: Options<T>) {
        this._connectionList = options.connectionList

        this._model = new Model({
            channel: options.channel,
            context: options.context
        })

        this._model.register(options.type, "user")
        this._model.plugin(new ConnectionPlugin(options.connectionList))
        this._model.plugin(new OwnerAuthorityPlugin())

        this._user = this._model.instantiate(options.type, options.context.userId)
        
        options.connectionList.emitter().on('connected', this._onConnected)
        options.connectionList.emitter().on('disconnected', this._onDisconnected)

        this._model.emitter().on('created', user => this._onUserCreated(user as T))

        for (const user of this._connectionList.users())
            this._onConnected(user)
    }

    user(): T {
        return this._user
    }

    users(): T[] {
        return [this._user, ...this._others]
    }

    others() {
        return [...this._others]
    }

    emitter(): IEmitter<PresenceEvents<T>> {
        return this._emitter
    }

    /*
     * Has to be called whenever the user has changed
    */
    send() {
        this._model.send()
    }

    register(callback: () => void): () => void {
        const unregisters: Record<string, () => void> = {}

        for (const user of [this._user, ...this._others])
            unregisters[user.id()] = user.register(callback)

        function onConnected(user: T) {
            unregisters[user.id()] = user.register(callback)
        }

        function onDisconnected(userId: string) {
            const unregisterUser = unregisters[userId]
            if (unregisterUser) {
                unregisterUser()
                delete unregisters[userId]
            }
        }

        // TODO: resolve issue
        this.emitter().on('connected', onConnected as any)
        this.emitter().on('disconnected', onDisconnected)
        
        return () => {
            this.emitter().off('connected', onConnected as any)
            this.emitter().off('disconnected', onDisconnected)
            for (const unregister of Object.values(unregisters))
                unregister()
        }
    }

    private _onUserCreated = (user: T) => {
        const isConnected = this._connectionList.isConnected(user.id())
        if (isConnected && !this._others.includes(user)) {
            this._others.push(user)
            this._emitter.emit('changed', this.users())
            this._emitter.emit('connected', user)
        }
    }

    private _onConnected = (userId: string) => {
        if (userId === this._user.id())
            return

        if (this._others.some(user => user.id() === userId))
            return

        const user = this._model.get<T>(userId)

        if (user) {
            this._others.push(user)
            this._emitter.emit('changed', this.users())
            this._emitter.emit('connected', user)
        }
    }

    private _onDisconnected = (userId: string) => {
        if (userId === this._user.id())
            return
        
        const index = this._others.findIndex(user => user.id() === userId)
        if (index < 0)
            return
        
        this._others.splice(index, 1)
        this._emitter.emit('changed', this.users())
        this._emitter.emit('disconnected', userId)
    }

}