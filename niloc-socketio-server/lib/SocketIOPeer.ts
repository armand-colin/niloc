import { Emitter, Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";

interface SocketIOPeerEvents {
    disconnect: void
}

type PeerMessage = {
    channel: number,
    message: Message
}

interface PeerEvents {
    message: PeerMessage
}

export class SocketIOPeer extends Peer {

    private _emitter = new Emitter<PeerEvents>()
    private _socketIOEmitter = new Emitter<SocketIOPeerEvents>()
    private _socket: Socket

    constructor(identity: Identity, socket: Socket) {
        super(identity)
        this._socket = socket

        socket.on('message', this._onMessage)
        socket.on('disconnect', () => {
            this.destroy()
            this._socketIOEmitter.emit('disconnect')
        })
    }

    get socketIOEmitter() { 
        return this._socketIOEmitter 
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
            console.error(`Error receiving network message (${this.id})`, e)
        }
    }

}