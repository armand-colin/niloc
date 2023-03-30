import { Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils";
import { Socket } from "socket.io-client"
import { SocketIOPeer } from "./SocketIOPeer";

export class SocketIONetwork implements Network {

    private _id: string
    private _emitter = new Emitter<NetworkEvents>()
    private _peer: SocketIOPeer

    constructor(id: string, socket: Socket) {
        this._id = id
        this._peer = new SocketIOPeer("HOST", socket)
        this._peer.emitter().on('message', ({ channel, message }) => {
            this._emitter.emit('message', { 
                peerId: this._peer.id(),
                channel, 
                message 
            })
        })
    }

    id(): string { return this._id }
    emitter(): Emitter<NetworkEvents> { return this._emitter }

    *peers(): Iterable<Peer> {
        yield this._peer
    }

}