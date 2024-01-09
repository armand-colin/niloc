import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { Model } from "../Model";
import { SyncObject } from "../SyncObject";
import { Emitter } from "@niloc/utils";
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

export class Presence<T extends SyncObject> extends Emitter<PresenceEvents<T>> {

    private _connectionList: ConnectionList
    private _model: Model
    private _emitter = new Emitter<PresenceEvents<T>>()

    private _user: T
    private _others = [] as T[]

    constructor(options: Options<T>) {
        super()

        this._connectionList = options.connectionList

        this._model = new Model({
            channel: options.channel,
            context: options.context
        })

        this._model
            .addType(options.type, "user")
            .addPlugin(new ConnectionPlugin(options.connectionList))
            .addPlugin(new OwnerAuthorityPlugin())

        this._user = this._model.instantiate(options.type, options.context.userId)
        
        options.connectionList.emitter().on('connected', this._onConnected)
        options.connectionList.emitter().on('disconnected', this._onDisconnected)

        this._model.on('created', user => this._onUserCreated(user as T))

        for (const user of this._connectionList.users())
            this._onConnected(user)
    }

    get user(): T {
        return this._user
    }

    get users(): T[] {
        return [this._user, ...this._others]
    }

    get others() {
        return [...this._others]
    }

    model() {
        return this._model
    }

    /*
     * Has to be called whenever the user has changed
     * Shortcut for `model.send()`
     */
    send() {
        this._model.send()
    }

    register(callback: () => void): () => void {
        const registeredObjects: Record<string, SyncObject> = {}

        for (const user of [this._user, ...this._others]) {
            registeredObjects[user.id] = user
            user.registerAll(callback)
        }

        function onConnected(user: T) {
            if (registeredObjects[user.id])
                return

            registeredObjects[user.id] = user
            user.registerAll(callback)
        }

        function onDisconnected(userId: string) {
            if (!registeredObjects[userId])
                return
            
            const user = registeredObjects[userId]
            user.unregisterAll(callback)
            delete registeredObjects[userId]
        }

        // TODO: resolve issue
        this.on('connected', onConnected as any)
        this.on('disconnected', onDisconnected)
        
        return () => {
            this.off('connected', onConnected as any)
            this.off('disconnected', onDisconnected)
            for (const object of Object.values(registeredObjects)) 
                object.unregisterAll(callback)
        }
    }

    private _onUserCreated = (user: T) => {
        const isConnected = this._connectionList.isConnected(user.id)
        if (isConnected && !this._others.includes(user)) {
            this._others.push(user)
            this._emitter.emit('changed', this.users)
            this._emitter.emit('connected', user)
        }
    }

    private _onConnected = (userId: string) => {
        if (userId === this._user.id)
            return

        if (this._others.some(user => user.id === userId))
            return

        const user = this._model.get<T>(userId)

        if (user) {
            this._others.push(user)
            this._emitter.emit('changed', this.users)
            this._emitter.emit('connected', user)
        }
    }

    private _onDisconnected = (userId: string) => {
        if (userId === this._user.id)
            return
        
        const index = this._others.findIndex(user => user.id === userId)
        if (index < 0)
            return
        
        this._others.splice(index, 1)
        this._emitter.emit('changed', this.users)
        this._emitter.emit('disconnected', userId)
    }

}