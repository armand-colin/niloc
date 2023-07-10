import { Address, Emitter, Message, Peer } from "niloc-core";
import { Socket } from "socket.io-client";

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
    private _socket: Socket

    constructor(id: string, socket: Socket) {
        this._id = id
        this._socket = socket
        this._address = Address.broadcast()

        this._socket.on('message', this._onMessage)
    }

    id(): string { return this._id }
    address(): Address { return this._address }
    emitter(): Emitter<PeerEvents> { return this._emitter }

    send(channel: number, message: Message): void {
        this._socket.send(channel, JSON.stringify(message))
    }

    private _onMessage = (channel: any, message: any) => {
        if (typeof channel !== "number")
            return
        if (typeof message !== "string")
            return
        try {
            const messageObject = JSON.parse(message)
            if (typeof messageObject !== "object")
                return
            this._emitter.emit('message', { channel, message: messageObject })
        } catch (e) {
            console.error('Error while parsing message', e)
        }
    }

}