import { Emitter } from "@niloc/utils"
import { Message } from "./Message"
import { Peer } from "./Peer"

export interface NetworkEvents {
    message: {
        peerId: string,
        channel: number, 
        message: Message
    }
}

export abstract class Network<P extends Peer = Peer> extends Emitter<NetworkEvents> {

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

    protected abstract peers(): Iterable<P>

}
