import { Emitter } from "@niloc/utils";
import { Address, Peer } from "../lib/main";

interface PeerEvents {
    message: {
        channel: number,
        message: any
    }
}

export namespace MockPeers {

    export function make(ids:string[]): Peer[] {
        return ids.map(id => {
            const emitter = new Emitter<PeerEvents>()

            return {
                address() { return Address.to(id) },
                emitter() { return emitter },
                id() { return id },
                send(_channel, _message) { },
            }
        })
    }

}