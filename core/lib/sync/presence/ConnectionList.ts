import { Address } from "../../core/Address"
import { Channel } from "../../channel/Channel"
import { Emitter } from "@niloc/utils"
import { Identity } from "../../core/Identity"
import { Message } from "../../core/Message"
import { Serializable } from "../../serialize/Serializable"
import { staticImplements } from "../../tools/staticImplements"
import { Deserializer } from "../../serialize/Deserializer"
import { BinaryReader, BinaryWriter } from "../../main"

enum ConnectionListMessageType {
    Connected = 0,
    Disconnected = 1,
    Sync = 2
}

type ConnectionListMessageData = {
    type: ConnectionListMessageType.Connected,
    identity: Identity
} | {
    type: ConnectionListMessageType.Disconnected,
    userId: string
} | {
    type: ConnectionListMessageType.Sync,
    users: Identity[]
}

export type ConnectionListEvents = {
    connected: Identity
    disconnected: string
    sync: void
}

@staticImplements<Deserializer<ConnectionListMessage>>()
class ConnectionListMessage implements Serializable {

    constructor(
        readonly data: ConnectionListMessageData
    ) { }

    serialize(writer: BinaryWriter): void {
        writer.writeU8(this.data.type)

        const data = this.data

        switch (data.type) {
            case ConnectionListMessageType.Connected:
                data.identity.serialize(writer)
                break

            case ConnectionListMessageType.Disconnected:
                writer.writeString(data.userId)
                break

            case ConnectionListMessageType.Sync:
                writer.writeU(data.users.length)
                for (const user of data.users)
                    user.serialize(writer)
                break
        }
    }

    static deserialize(reader: BinaryReader): ConnectionListMessage {
        const type = reader.readU8()

        switch (type) {
            case ConnectionListMessageType.Connected:
                return new ConnectionListMessage({
                    type,
                    identity: Identity.deserialize(reader)
                })

            case ConnectionListMessageType.Disconnected:
                return new ConnectionListMessage({
                    type,
                    userId: reader.readString()
                })

            case ConnectionListMessageType.Sync:
                const n = reader.readU()
                const users = new Array(n)
                for (let i = 0; i < n; i++)
                    users[i] = Identity.deserialize(reader)

                return new ConnectionListMessage({
                    type,
                    users
                })

            default:
                throw new Error('Unknown ConnectionListMessageType: ' + type)
        }
    }

}

export type ConnectionListOpts = {
    isOwner: boolean,
    channel: Channel<any>,
}

export class ConnectionList extends Emitter<ConnectionListEvents> {

    static owner(channel: Channel<any>) {
        return new ConnectionList({
            isOwner: true,
            channel
        })
    }

    static client(channel: Channel<any>) {
        return new ConnectionList({
            isOwner: false,
            channel
        })
    }

    private _isOwner: boolean
    private _channel: Channel<ConnectionListMessage>

    private _users = new Map<string, Identity>()

    private constructor(opts: ConnectionListOpts) {
        super()

        this._isOwner = opts.isOwner
        this._channel = opts.channel

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

            this._channel.post({
                address: Address.broadcast(),
                data: new ConnectionListMessage({
                    type: ConnectionListMessageType.Connected,
                    identity,
                })
            })

            this._channel.post({
                address: Address.to(identity.userId),
                data: new ConnectionListMessage({
                    type: ConnectionListMessageType.Sync,
                    users: [...this._users.values()]
                })
            })
        }
    }

    disconnected(userId: string): void {
        if (!this._users.has(userId))
            return

        this._disconnected(userId)

        // Broadcast message
        if (this._isOwner)
            this._channel.post({
                address: Address.broadcast(),
                data: new ConnectionListMessage({
                    type: ConnectionListMessageType.Disconnected,
                    userId: userId
                }),
            })
    }

    private _connected(identity: Identity) {
        this._users.set(identity.userId, identity)
        this.emit('connected', identity)
    }

    private _disconnected(userId: string) {
        this._users.delete(userId)
        this.emit('disconnected', userId)
    }

    private _sync(users: Identity[]) {
        for (const userId of [...this._users.keys()]) {
            if (!users.find(user => user.userId === userId))
                this._disconnected(userId)
        }

        for (const user of users) {
            if (!this._users.has(user.userId))
                this._connected(user)
        }

        this.emit('sync', undefined)
    }

    private _onMessage = (channelMessage: Message<ConnectionListMessage>) => {
        const message = channelMessage.deserialize(ConnectionListMessage)

        switch (message.data.type) {
            case ConnectionListMessageType.Connected: {
                if (this._isOwner || this._users.has(message.data.identity.userId))
                    return

                this._connected(message.data.identity)
                break
            }
            case ConnectionListMessageType.Disconnected: {
                if (this._isOwner || !this._users.has(message.data.userId))
                    return

                this._disconnected(message.data.userId)
                break
            }
            case ConnectionListMessageType.Sync: {
                if (this._isOwner)
                    return

                this._sync(message.data.users)
            }
        }
    }

}