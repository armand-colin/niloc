import { Identity, Message, Peer } from "@niloc/core";
import { Socket } from "./Socket";


export class SocketIOPeer extends Peer {

    private _socket: Socket

    constructor(identity: Identity, socket: Socket) {
        super(identity)
        this._socket = socket

        this._socket.on('message', this._onMessage)
    }

    send(channel: number, message: Message<any>): void {
        this._socket.send(channel, JSON.stringify(message))
    }
    
    match(): boolean {
        return true
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
            this.emit('message', { channel, message: messageObject })
        } catch (e) {
            console.error('Error while parsing message', e)
        }
    }

}