import { Identity, Network, Peer } from "@niloc/core";
import { SocketIOPeer } from "./SocketIOPeer";
import { Socket } from "./Socket";

export class SocketIONetwork extends Network {

    private _serverPeer: SocketIOPeer

    constructor(socket: Socket) {
        super()

        this._serverPeer = new SocketIOPeer(new Identity("SERVER"), socket)
        
        socket.on('connect', () => this.setConnected(true))
        socket.on('disconnect', () => this.setConnected(false))
        
        this.connect(this._serverPeer)
        this.setConnected(socket.connected)
    }

    *peers(): Iterable<Peer> {
        yield this._serverPeer
    }

}