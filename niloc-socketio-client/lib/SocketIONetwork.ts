import { Emitter, Identity, Network, NetworkEvents, Peer } from "@niloc/core";
import { SocketIOPeer } from "./SocketIOPeer";
import { Socket } from "./Socket";

export class SocketIONetwork extends Emitter<NetworkEvents> implements Network {

    private _serverPeer: SocketIOPeer
    private _identity: Identity

    constructor(identity: Identity, socket: Socket) {
        super()

        this._identity = identity
        this._serverPeer = new SocketIOPeer(new Identity("SERVER"), socket)
        
        this._serverPeer.addListener(({ channel, message }) => {
            this.emit('message', { 
                peerId: this._serverPeer.id,
                channel, 
                message 
            })
        })
    }

    identity(): Identity {
        return this._identity
    }

    *peers(): Iterable<Peer> {
        yield this._serverPeer
    }

}