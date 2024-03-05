import { Emitter } from "@niloc/utils"
import { Message } from "./Message"
import { Peer } from "./Peer"
import { INetwork } from "./Network.interface"

export interface NetworkEvents {
    connected: void,
    disconnected: void,
    message: {
        peerId: string,
        channel: number, 
        message: Message
    }
}

export abstract class Network<P extends Peer = Peer> extends Emitter<NetworkEvents> implements INetwork {

    private _connected = false

    get connected() { 
        return this._connected 
    }

    send(channel: number, message: Message, senderId: string): void {
        for (const peer of this.peers()) {
            if (peer.identity.userId === senderId)
                continue

            if (peer.match(message.address, senderId))
                peer.send(channel, message)
        }
    }

    protected connect(peer: P) {
        peer.on('message', ({ channel, message }) => {
            this.emit('message', { 
                peerId: peer.identity.userId, 
                channel, 
                message 
            })
        })
    }

    protected setConnected(connected: boolean) {
        if (connected === this._connected)
            return

        this._connected = connected

        if (connected)
            this.emit("connected")
        else
            this.emit("disconnected")
    }

    protected abstract peers(): Iterable<P>

}
