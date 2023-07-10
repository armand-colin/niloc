import { Address, Emitter, Message, Peer } from "niloc-core";
import { Socket } from "socket.io";

interface SocketIOPeerEvents {
    disconnect: void
}

interface PeerEvents {
    message: {
        channel: number,
        message: Message
    }
}

export class SocketIOPeer implements Peer {

    private _id: string
    private _address: Address
    private _emitter = new Emitter<PeerEvents>()
    private _socketIOEmitter = new Emitter<SocketIOPeerEvents>()
    private _socket: Socket

    constructor(socket: Socket, id: string, host: boolean) {
        this._id = id
        this._address = host ? Address.host() : Address.to(id)
        this._socket = socket

        socket.on('message', this._onMessage)
        socket.on('disconnect', () => {
            this.destroy()
            this._socketIOEmitter.emit('disconnect')
        })
    }

    id(): string { return this._id }
    address(): Address { return this._address }
    emitter(): Emitter<PeerEvents> { return this._emitter }
    socketIOEmitter() { return this._socketIOEmitter }

    send(channel: number, message: Message): void {
        this._socket.send(channel, JSON.stringify(message))
    }

    destroy() {
        this._socket.removeAllListeners()
    }

    private _onMessage = (channel: any, message: any) => {
        if (!(typeof channel === "number"))
            return
        if (!(typeof message === "string"))
            return

        try {
            const messageObject = JSON.parse(message)
            if (!messageObject)
                return
            this._emitter.emit('message', { channel, message: messageObject })
        } catch (e) {
            console.error(`Error receiving network message (${this._id})`, e)
        }
    }

}