import { Address, Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils";
import { Socket } from "socket.io-client"
import { SocketIOPeer } from "./SocketIOPeer";

export class SocketIONetwork implements Network {

    private _id: string
    private _address: Address
    private _emitter = new Emitter<NetworkEvents>()
    private _serverPeer: SocketIOPeer

    constructor(id: string, socket: Socket, host = false) {
        this._id = id
        this._address = host ? Address.host() : Address.to(id)
        this._serverPeer = new SocketIOPeer("SERVER", socket)
        this._serverPeer.emitter().on('message', ({ channel, message }) => {
            this._emitter.emit('message', { 
                peerId: this._serverPeer.id(),
                channel, 
                message 
            })
        })
    }

    id(): string { return this._id }
    address(): Address { return this._address }
    emitter(): Emitter<NetworkEvents> { return this._emitter }

    *peers(): Iterable<Peer> {
        yield this._serverPeer
    }

}