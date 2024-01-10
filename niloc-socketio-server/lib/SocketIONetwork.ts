import { Emitter, Identity, Network, NetworkEvents, Peer } from "@niloc/core"
import { SocketIOPeer } from "./SocketIOPeer";
import { Socket } from "./Socket";

type SocketIONetworkOpts = {
    /**
     * @default false
     */
    host?: boolean
}

export class SocketIONetwork extends Emitter<NetworkEvents> implements Network {

    private _peers = new Map<string, SocketIOPeer>()
    private _identity: Identity

    constructor(opts?: SocketIONetworkOpts) {
        super()
        this._identity = new Identity("SERVER", opts?.host ?? false)
    }

    identity(): Identity {
        return this._identity
    }

    peers(): Iterable<Peer> { 
        return this._peers.values() 
    }

    addSocket(socket: Socket, peerId: string, host: boolean) {
        if (this._peers.has(peerId))
            return // TODO: disconnect socket ?

        const peer = new SocketIOPeer(new Identity(peerId, host), socket)

        peer.socketIOEmitter.on('disconnect', () => {
            const current = this._peers.get(peerId)
            if (current === peer)
                this._peers.delete(peerId)
        })

        peer.addListener(data => {
            this.emit('message', { peerId, ...data })
        })

        this._peers.set(peerId, peer)
    }

}