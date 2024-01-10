import { Address } from "../lib/core/Address";
import { Emitter } from "@niloc/utils";
import { Network, NetworkEvents } from "../lib/core/Network";
import { Peer } from "../lib/core/Peer";
import { Identity, Message } from "../lib/main";

interface PeerEvents {
    message: {
        channel: number,
        message: any
    }
}

class FlatPeer extends Peer {

    emitter = new Emitter<PeerEvents>()
    sibling: FlatPeer | null = null

    send(channel: number, message: Message<any>): void {
        this.sibling?.emitter.emit('message', { channel, message })
    }

}

export class FlatNetwork extends Emitter<NetworkEvents> implements Network {

    constructor(readonly id, private readonly _peers: Peer[]) {
        super()
    }

    peers(): Iterable<Peer> {
        return this._peers
    }

}

export namespace FlatNetwork {

    function bind(a: FlatPeer, b: FlatPeer) {
        a.sibling = b
        b.sibling = a
    }

    function peer(id: string, all = false): FlatPeer {
        const address = all ? Address.broadcast() :
            Address.to(id)

        const identity = new Identity(id)

        return new FlatPeer(identity, address)
    }

    function network(id: string, peers: FlatPeer[]): FlatNetwork {
        const network = new FlatNetwork(id, peers)

        for (const peer of peers) {
            peer.emitter.on('message', ({ channel, message }) => {
                network.emit('message', ({ peerId: peer.id, channel, message }))
            })
        }

        return network
    }

    export function star(guests: number): FlatNetwork[] {
        const hostPeers = Array(guests).fill(null).map((_, i) => peer('guest' + i))
        const host = network("host", hostPeers)
        const networks = [host]

        for (const hostPeer of hostPeers) {
            const clientPeer = peer('host', false)
            bind(hostPeer, clientPeer)
            const client = network(hostPeer.id, [clientPeer])
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