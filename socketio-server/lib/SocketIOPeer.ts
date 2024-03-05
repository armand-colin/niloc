import { Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";

export class SocketIOPeer extends Peer {

    private _socket: Socket

    constructor(identity: Identity, socket: Socket) {
        super(identity)
        this._socket = socket

        socket.on('message', this._onMessage)
        socket.on('disconnect', () => this.destroy())
    }

    send(channel: number, message: Message): void {
        this._socket.send(channel, JSON.stringify(message))
    }

    destroy() {
        super.destroy()
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
            this.emit('message', { channel, message: messageObject })
        } catch (e) {
            console.error(`Error receiving network message (${this.identity.userId})`, e)
        }
    }

}