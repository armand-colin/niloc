import { Address, Network, NetworkEvents, Peer } from "niloc-core"
import { Socket } from "socket.io";
import { Emitter } from "utils";
import { SocketIOPeer } from "./SocketIOPeer";

export class SocketIONetwork implements Network {

    private _address: Address
    private _peers = new Map<string, SocketIOPeer>()
    private _emitter = new Emitter<NetworkEvents>()

    constructor(host: boolean) {
        this._address = host ? Address.host() : Address.to("SERVER")
    }

    id(): string { return "SERVER" }
    address(): Address { return this._address }
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

        peer.emitter().on('message', (data) => {
            this._emitter.emit('message', { peerId, ...data })
        })

        this._peers.set(peerId, peer)
    }

}