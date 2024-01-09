import { Address } from "../../core/Address"
import { Channel  } from "../../channel/Channel"
import { Emitter } from "@niloc/utils"
import { Message } from "../../core/Message"

type ConnectionListMessage = {
    type: "connected",
    userId: string
} | {
    type: "disconnected",
    userId: string
} | {
    type: "sync",
    userIds: string[]
}

export type ConnectionListEvents = {
    connected: string
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

    private _users = new Set<string>()
    private _emitter = new Emitter<ConnectionListEvents>()

    private constructor(owner: boolean, channel: Channel<any>) {
        super()

        this._isOwner = owner
        this._channel = channel

        this._channel.addListener(this._onMessage)
    }

    users(): IterableIterator<string> {
        return this._users.values()
    }

    isConnected(userId: string): boolean {
        return this._users.has(userId)
    }

    connected(userId: string): void {
        if (this._users.has(userId))
            return

        this._connected(userId)

        // Broadcast message
        if (this._isOwner) {
            this._channel.post(Address.broadcast(), { type: "connected", userId })
            this._channel.post(Address.to(userId), { 
                type: "sync",
                userIds: [...this._users]
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

    private _connected(userId: string) {
        this._users.add(userId)
        this._emitter.emit('connected', userId)
    }

    private _disconnected(userId: string) {
        this._users.delete(userId)
        this._emitter.emit('disconnected', userId)
    }

    private _sync(userIds: string[]) {
        for (const userId of [...this._users]) {
            if (!userIds.includes(userId))
                this._disconnected(userId)
        }

        for (const userId of userIds) {
            if (!this._users.has(userId))
                this._connected(userId)
        }

        this._emitter.emit('sync')
    }

    private _onMessage = (message: Message<ConnectionListMessage>) => {
        switch (message.data.type) {
            case "connected": {
                if (this._isOwner || this._users.has(message.data.userId))
                    return

                this._connected(message.data.userId)
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

                this._sync(message.data.userIds)
            } 
        }
    }

}