import { Emitter } from "@niloc/utils";
import { Identity } from "../lib/main";

interface PeerEvents {
    message: {
        channel: number,
        message: any
    }
}

class MockPeer {

    emitter = new Emitter<PeerEvents>()

    readonly identity: Identity

    constructor(userId: string) {
        this.identity = new Identity(userId)
    }

    send(channel: number, message: any): void {
        this.emitter.emit('message', { channel, message })
    }

}

export namespace MockPeers {

    export function make(ids: string[]): MockPeer[] {
        return ids.map(id => new MockPeer(id))
    }

}