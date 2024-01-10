import { Address } from "../../core/Address"
import { Channel  } from "../../channel/Channel"
import { Emitter } from "@niloc/utils"
import { Message } from "../../core/Message"
import { Identity } from "../../main"
import { SerializedIdentity } from "../../core/Identity"

type ConnectionListMessage = {
    type: "connected",
    identity: SerializedIdentity
} | {
    type: "disconnected",
    userId: string
} | {
    type: "sync",
    users: SerializedIdentity[]
}

export type ConnectionListEvents = {
    connected: Identity
    disconnected: string
    sync: void
}

export class ConnectionList extends Emitter<ConnectionListEvents> {

    static owner(channel: Channel<any>) {
        return new ConnectionList(true, channel)
    }

    static client(channel: Channel<any>) {
        return new ConnectionList(false, channel)
    }

    private _isOwner: boolean
    private _channel: Channel<ConnectionListMessage>

    private _users = new Map<string, Identity>()
    private _emitter = new Emitter<ConnectionListEvents>()

    private constructor(owner: boolean, channel: Channel<any>) {
        super()

        this._isOwner = owner
        this._channel = channel

        this._channel.addListener(this._onMessage)
    }

    users(): IterableIterator<Identity> {
        return this._users.values()
    }

    isConnected(userId: string): boolean {
        return this._users.has(userId)
    }

    connected(identity: Identity): void {
        if (this._users.has(identity.userId))
            return

        this._connected(identity)

        // Broadcast message
        if (this._isOwner) {
            this._channel.post(Address.broadcast(), { 
                type: "connected",
                identity: identity.serialize()
            })

            this._channel.post(Address.to(identity.userId), { 
                type: "sync",
                users: [...this._users.values()]
                    .map(identity => identity.serialize())
            })
        }
    }

    disconnected(userId: string): void {
        if (!this._users.has(userId))
            return

        this._disconnected(userId)

        // Broadcast message
        if (this._isOwner)
            this._channel.post(Address.broadcast(), { type: "disconnected", userId })
    }

    private _connected(identity: Identity) {
        this._users.set(identity.userId, identity)
        this._emitter.emit('connected', identity)
    }

    private _disconnected(userId: string) {
        this._users.delete(userId)
        this._emitter.emit('disconnected', userId)
    }

    private _sync(users: SerializedIdentity[]) {
        for (const userId of [...this._users.keys()]) {
            if (!users.find(user => user.userId === userId))
                this._disconnected(userId)
        }

        for (const user of users) {
            if (!this._users.has(user.userId))
                this._connected(Identity.deserialize(user))
        }

        this._emitter.emit('sync')
    }

    private _onMessage = (message: Message<ConnectionListMessage>) => {
        switch (message.data.type) {
            case "connected": {
                if (this._isOwner || this._users.has(message.data.identity.userId))
                    return

                this._connected(Identity.deserialize(message.data.identity))
                break
            }
            case "disconnected": {
                if (this._isOwner || !this._users.has(message.data.userId))
                    return

                this._disconnected(message.data.userId)
                break
            }
            case "sync": {
                if (this._isOwner)
                    return

                this._sync(message.data.users)
            } 
        }
    }

}