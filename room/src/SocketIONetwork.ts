import { Address, AddressType, BinaryReader, BinaryWriter, Message, Network } from "@niloc/core";
import { NetworkMessageHandler } from "@niloc/core/dist/core/Network";
import { Socket } from "socket.io";

class ConnectedSocket {

    private _writer = new BinaryWriter()
    private _messageHandlers: NetworkMessageHandler[] = []

    constructor(
        readonly socket: Socket,
        readonly userId: string,
        readonly isHost: boolean
    ) {
        socket.on('message', this._onMessage)
    }

    send(channel: number, message: Message) {
        this._writer.clear()
        message.serialize(this._writer)
        this.socket.send(channel, this._writer.collect())
    }

    onMessage(handler: NetworkMessageHandler) {
        this._messageHandlers.push(handler)
    }

    private _onMessage = (channel: number, buffer: ArrayBuffer) => {
        console.log('on message', channel, new Uint8Array(buffer))

        const reader = new BinaryReader(new Uint8Array(buffer))
        const message = Message.deserialize(reader)

        for (const handler of this._messageHandlers)
            handler(channel, message)
    }

    destroy() {
        this.socket.off('message', this._onMessage)
        this._messageHandlers.length = 0
    }

}

export class SocketIONetwork implements Network {

    private _sockets: ConnectedSocket[] = []
    private _messageListeners: NetworkMessageHandler[] = []

    removeSocket(socket: Socket): string | null {
        const currentIndex = this._sockets.findIndex(connected => connected.socket === socket)

        if (currentIndex > -1) {
            const currentSocket = this._sockets[currentIndex]
            this._sockets.splice(currentIndex, 1)
            currentSocket.destroy()
            return currentSocket.userId
        }

        return null
    }

    addSocket(socket: Socket, userId: string, isHost: boolean) {
        const currentIndex = this._sockets.findIndex(socket => socket.userId === userId)
        if (currentIndex > -1) {
            const currentSocket = this._sockets[currentIndex]
            this._sockets.splice(currentIndex, 1)
            currentSocket.destroy()
        }

        const connected = new ConnectedSocket(socket, userId, isHost)
        this._sockets.push(connected)
        connected.onMessage(this._onMessage)
    }

    send(channel: number, message: Message): void {
        switch (message.address.type) {
            case AddressType.All: {
                for (const socket of this._sockets)
                    socket.send(channel, message)
                break
            }
            case AddressType.Host: {
                for (const socket of this._sockets)
                    if (socket.isHost)
                        socket.send(channel, message)
                break
            }
            case AddressType.Broadcast: {
                for (const socket of this._sockets)
                    if (socket.userId !== message.originId)
                        socket.send(channel, message)
                break
            }
            case AddressType.Target: {
                for (const socket of this._sockets)
                    if (socket.userId === message.address.id)
                        socket.send(channel, message)
                break
            }
            case AddressType.Dynamic: {
                const userId = message.address.get()

                for (const socket of this._sockets)
                    if (socket.userId === userId)
                        socket.send(channel, message)

                break
            }
        }
    }

    onMessage(callback: NetworkMessageHandler): void {
        this._messageListeners.push(callback)
    }

    private _onMessage = (channel: number, message: Message) => {
        for (const listener of this._messageListeners)
            listener(channel, message)
    }

}