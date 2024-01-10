import { Emitter } from "@niloc/utils";
import { Identity, Peer } from "../lib/main";

interface PeerEvents {
    message: {
        channel: number,
        message: any
    }
}

class MockPeer extends Peer {

    emitter = new Emitter<PeerEvents>()

    send(channel: number, message: any): void {
        this.emitter.emit('message', { channel, message })
    }

}

export namespace MockPeers {

    export function make(ids: string[]): Peer[] {
        return ids.map(id => new MockPeer(new Identity(id)))
    }

}