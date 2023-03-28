import { Network, Peer } from "niloc-core"
import { Socket } from "socket.io";

export class SocketIONetwork implements Network {

    private _sockets = new Map<string, Socket>()

    constructor() { }

    addSocket(socket: Socket) {

    }

    id(): string {
        return "host"
    }

    peers(): Iterable<Peer> {
        throw new Error("Method not implemented.");
    }

}