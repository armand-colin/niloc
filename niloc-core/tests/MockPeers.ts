import { Emitter } from "utils";
import { Address, Peer, PeerEvents } from "../lib/main";

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