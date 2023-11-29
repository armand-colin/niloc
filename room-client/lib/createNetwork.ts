import { SocketIONetwork } from '@niloc/socketio-client'
import io from "socket.io-client"

export function createNetwork(options: {
    url: string,
    id: string,
    room: string,
    host: boolean,
    connectionListChannel?: number
}) {
    const socket = io(options.url, {
        query: {
            peerId: options.id,
            host: options.host,
            roomId: options.room,
            presence: options.connectionListChannel
        }
    })

    const network = new SocketIONetwork(socket)

    return network
}