import { Address } from "../lib/core/Address";
import { Emitter } from "utils";
import { Network, NetworkEvents } from "../lib/core/Network";
import { Peer, PeerEvents } from "../lib/core/Peer";

interface FlatPeer extends Peer {
    _sibling: FlatPeer | null
}

export interface FlatNetwork extends Network {
    
    id(): string

}

export namespace FlatNetwork {

    function bind(a: FlatPeer, b: FlatPeer) {
        a._sibling = b
        b._sibling = a
    }

    function peer(id: string, all = false): FlatPeer {
        const emitter = new Emitter<PeerEvents>()
        const address = all ? Address.broadcast() :
            Address.to(id)

        return {
            _sibling: null,
            id() { return id },
            emitter() { return emitter },
            address() { return address },
            send(channel, message) {
                this._sibling?.emitter().emit('message', { channel, message })
            }
        }
    }

    function network(id: string, peers: Peer[]): FlatNetwork {
        const emitter = new Emitter<NetworkEvents>()
        for (const peer of peers) {
            peer.emitter().on('message', ({ channel, message }) => {
                emitter.emit('message', ({ peerId: peer.id(), channel, message }))
            })
        }

        return {
            id() { return id },
            peers() { return peers },
            emitter() { return emitter },
        }
    }

    export function star(guests: number): FlatNetwork[] {
        const hostPeers = Array(guests).fill(null).map((_, i) => peer('guest' + i))
        const host = network("host", hostPeers)
        const networks = [host]

        for (const hostPeer of hostPeers) {
            const clientPeer = peer('host', false)
            bind(hostPeer, clientPeer)
            const client = network(hostPeer.id(), [clientPeer])
            networks.push(client)
        }

        return networks
    }

    export function pair(): [Network, Network] {
        const [peerA, peerB] = [peer('a'), peer('b')]

        bind(peerA, peerB)

        const a = network("a", [peerB])
        const b = network("b", [peerA])

        return [a, b]
    }

}