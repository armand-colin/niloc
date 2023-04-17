import { Network, NetworkEvents, Peer } from "niloc-core"
import { Socket } from "socket.io";
import { Emitter } from "utils";
import { SocketIOPeer } from "./SocketIOPeer";

export class SocketIONetwork implements Network {

    private _peers = new Map<string, SocketIOPeer>()
    private _emitter = new Emitter<NetworkEvents>()

    constructor() { }

    addSocket(socket: Socket) {
        // TODO: safe check
        const id = socket.handshake.query.peerId as string
        if (this._peers.has(id))
            return // TODO: disconnect socket ?

        const peer = new SocketIOPeer(id, socket)

        peer.socketIOEmitter().on('disconnect', () => {
            const current = this._peers.get(id)
            if (current === peer)
                this._peers.delete(id)
        })

        peer.emitter().on('message', (data) => {
            this._emitter.emit('message', { peerId: id, ...data })
        })

        this._peers.set(id, peer)
    }

    id(): string { return "HOST" }
    peers(): Iterable<Peer> { return this._peers.values() }
    emitter(): Emitter<NetworkEvents> { return this._emitter }

}