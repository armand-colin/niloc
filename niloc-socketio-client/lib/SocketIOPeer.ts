import { Address, Emitter, Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";

type PeerMessage = {
    channel: number,
    message: Message
}

interface PeerEvents {
    message: PeerMessage
}

export class SocketIOPeer extends Peer {

    private _emitter = new Emitter<PeerEvents>()
    private _socket: Socket

    constructor(identity: Identity, socket: Socket) {
        super(identity, Address.broadcast())
        this._socket = socket

        this._socket.on('message', this._onMessage)
    }

    send(channel: number, message: Message): void {
        this._socket.send(channel, JSON.stringify(message))
    }


    addListener(callback: (message: PeerMessage) => void) {
        this._emitter.on('message', callback)
    }

    removeListener(callback: (message: PeerMessage) => void) {
        this._emitter.off('message', callback)
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