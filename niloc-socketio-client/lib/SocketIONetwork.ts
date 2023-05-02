import { Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils";
import { Socket } from "socket.io-client"
import { SocketIOPeer } from "./SocketIOPeer";

export class SocketIONetwork implements Network {

    private _emitter = new Emitter<NetworkEvents>()
    private _serverPeer: SocketIOPeer

    constructor(socket: Socket) {
        this._serverPeer = new SocketIOPeer("SERVER", socket)
        this._serverPeer.emitter().on('message', ({ channel, message }) => {
            this._emitter.emit('message', { 
                peerId: this._serverPeer.id(),
                channel, 
                message 
            })
        })
    }

    emitter(): Emitter<NetworkEvents> { return this._emitter }

    *peers(): Iterable<Peer> {
        yield this._serverPeer
    }

}