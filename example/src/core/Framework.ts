import { Router } from "@niloc/core"
import { SocketIONetwork } from "@niloc/socketio-client"
import { io } from "socket.io-client"

type Options = {
    socketioUrl: string
    peerId: string
    roomId: string
    host: boolean
}

export class Framework {


    constructor(options: Options) {
        const socket = io(options.socketioUrl, {
            query: {
                roomId: options.roomId,
                peerId: options.peerId,
                host: options.host,
            }
        })

        const network = new SocketIONetwork(socket)
        const router = new Router({ id: options.peerId, network, host: options.host, relay: true })
    }

}