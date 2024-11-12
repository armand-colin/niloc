import { Channel } from "../../channel/Channel";
import { Identity } from "../../core/Identity";
import { Model } from "../Model";
import { SyncObject } from "../SyncObject";
import { Emitter } from "@niloc/utils";
import { ConnectionList } from "./ConnectionList";
import { ConnectionPlugin } from "./ConnectionPlugin";
import { SyncObjectType } from "../SyncObjectType";
import { OwnerAuthorityPlugin } from "./OwnerAuthorityPlugin";
import { User } from "./User";

export type PresenceEvents<T extends SyncObject> = {
    changed: T[],
    connected: T,
    disconnected: string
}

type UnregisterCallback = () => void

type Options<T extends User> = {
    identity: Identity,
    channel: Channel<any>,
    type: SyncObjectType<T>,
    connectionList: ConnectionList
}

export class Presence<T extends User> extends Emitter<PresenceEvents<T>> {

    private _connectionList: ConnectionList
    private _model: Model

    private _user: T
    private _others = [] as T[]

    constructor(options: Options<T>) {
        super()

        this._connectionList = options.connectionList

        this._model = new Model({
            channel: options.channel,
            identity: options.identity
        })

        this._model
            .addType(options.type, "user")
            .addPlugin(new ConnectionPlugin(options.connectionList))
            .addPlugin(new OwnerAuthorityPlugin())

        this._user = this._model.instantiate(options.type, options.identity.userId)
        
        options.connectionList.on('connected', this._onConnected)
        options.connectionList.on('disconnected', this._onDisconnected)

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

    get model() {
        return this._model
    }

    /*
     * Has to be called whenever the user has changed
     * Shortcut for `model.send()`
     */
    send() {
        this._model.send()
    }

    /**
     * Call `user.registerAll` for all users to be created, and call `callback` when a user either
     * connects, disconnects or changes.
     * @returns A callback to call when you want to unregister the listener
     */
    register(callback: () => void): UnregisterCallback {
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
        if (isConnected) {
            const currentIndex = this._others.findIndex(other => other.id === user.id)
            
            if (currentIndex > -1)
                this._others.splice(currentIndex, 1)

            this._others.push(user)
            this.emit('changed', this.users)
            this.emit('connected', user)
        }
    }

    private _onConnected = (identity: Identity) => {
        const userId = identity.userId

        if (userId === this._user.id)
            return

        if (this._others.some(user => user.id === userId))
            return

        const user = this._model.get<T>(userId)
        
        if (user) {
            User.__setIdentity(user, identity)
            this._others.push(user)
            this.emit('changed', this.users)
            this.emit('connected', user)
        }
    }

    private _onDisconnected = (userId: string) => {
        if (userId === this._user.id)
            return
        
        const index = this._others.findIndex(user => user.id === userId)
        if (index < 0)
            return
        
        this._others.splice(index, 1)
        this.emit('changed', this.users)
        this.emit('disconnected', userId)
    }

}