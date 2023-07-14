import { Address } from "../../core/Address";
import { Authority } from "../Authority";
import { Channel } from "../../channel/Channel";
import { Context } from "../../core/Context";
import { Model } from "../Model";
import { SyncObject } from "../SyncObject";
import { Template } from "../Template";
import { Message } from "../../core/Message";
import { Factory } from "../Template";
import { PresenceMessage } from "./PresenceMessage";
import type { Emitter } from "@niloc/utils";
import { Emitter as EmitterImpl } from "@niloc/utils";

export type PresenceEvents<T extends SyncObject> = {
    usersChanged: T[]
}

export class Presence<T extends SyncObject> {

    private _model: Model
    private _channel: Channel<PresenceMessage>

    private _user: T
    private _users: T[] = []

    private _connected: Record<string, boolean> = {}

    private _emitter = new EmitterImpl<PresenceEvents<T>>()

    constructor(context: Context, channel: Channel<any>, factory: Factory<T>) {
        const [modelChannel, presenceChannel] = Channel.split(channel, 2)

        this._channel = presenceChannel
        this._channel.addListener(this._onPresenceMessage)

        this._model = new Model({
            channel: modelChannel,
            context
        })

        const template = Template.create("user", factory, Authority.own())

        this._model.register(template)
        this._user = this._model.instantiate(template, context.userId)

        this._model.emitter().on('created', user => {
            this._onUserCreated(user as T)
        })
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

    /**
     * Has to be called whenever the user is updated
     */
    tick() {
        this._model.tick()
    }

    connected() {
        this._channel.post(Address.broadcast(), PresenceMessage.connected(this._user.id()))
    }

    private _onPresenceMessage = (message: Message<PresenceMessage>) => {
        switch (message.data.type) {
            case "connected": {
                if (this._connected[message.data.userId])
                    break

                this._connected[message.data.userId] = true
                this._updateUser(message.data.userId)

                // Sync data to new user
                this._model.syncTo(Address.to(message.data.userId))
                this._model.tick()

                break
            }
            case "disconnected": {
                if (!this._connected[message.data.userId])
                    break

                delete this._connected[message.data.userId]
                this._updateUser(message.data.userId)
                break
            }
        }
    }

    private _onUserCreated(user: T) {
        const connected = !!this._connected[user.id()]
        const index = this._users.indexOf(user)
        
        if (index === -1 && connected) {
            this._users.push(user)
            this._emitter.emit('usersChanged', this._users)
        } else if (index !== -1 && !connected) {
            this._users.splice(index, 1)
            this._emitter.emit('usersChanged', this._users)
        }
    }

    private _updateUser(userId: string) {
        const user = this._model.get<T>(userId)
        if (!user)
            return

        // TODO: Find better naming
        this._onUserCreated(user)
    }

}