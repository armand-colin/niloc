import { Emitter, Network, NetworkEvents, Peer } from "@niloc/core"
import { SocketIOPeer } from "./SocketIOPeer";
import { Socket } from "./Socket";

export class SocketIONetwork implements Network {

    private _peers = new Map<string, SocketIOPeer>()
    private _emitter = new Emitter<NetworkEvents>()

    peers(): Iterable<Peer> { return this._peers.values() }
    emitter(): Emitter<NetworkEvents> { return this._emitter }

    addSocket(socket: Socket, peerId: string, host: boolean) {
        if (this._peers.has(peerId))
            return // TODO: disconnect socket ?

        const peer = new SocketIOPeer(socket, peerId, host)

        peer.socketIOEmitter().on('disconnect', () => {
            const current = this._peers.get(peerId)
            if (current === peer)
                this._peers.delete(peerId)
        })

        peer.emitter().on('message', data => {
            this._emitter.emit('message', { peerId, ...data })
        })

        this._peers.set(peerId, peer)
    }

}