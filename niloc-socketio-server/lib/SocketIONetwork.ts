import { Identity, Network, Peer } from "@niloc/core"
import { SocketIOPeer } from "./SocketIOPeer";
import { Socket } from "./Socket";

export class SocketIONetwork extends Network {

    private _peers = new Map<string, SocketIOPeer>()

    peers(): Iterable<Peer> {
        return this._peers.values()
    }

    addSocket(socket: Socket, peerId: string, host: boolean) {
        if (this._peers.has(peerId))
            return // TODO: disconnect existing socket ?

        const peer = new SocketIOPeer(new Identity(peerId, host), socket)

        peer.on('destroy', () => {
            const current = this._peers.get(peerId)
            if (current === peer)
                this._peers.delete(peerId)
        })

        this._peers.set(peerId, peer)
        this.connect(peer)
    }

}