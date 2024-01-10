import { FrameworkChannels, Identity } from '@niloc/core'
import { SocketIONetwork } from '@niloc/socketio-client'
import io from "socket.io-client"

export function createNetwork(options: {
    url: string,
    identity: Identity,
    room: string,
    /**
     * @default `FrameworkChannels.ConnectionList`. If the value is `null`, 
     * the connection list will not be sent.
     */
    connectionListChannel?: number | null
}) {
    const socket = io(options.url, {
        query: {
            peerId: options.identity.userId,
            host: options.identity.host,
            roomId: options.room,
            presence: options.connectionListChannel === null ?
                undefined :
                options.connectionListChannel ?? FrameworkChannels.ConnectionList
        }
    })

    const network = new SocketIONetwork(options.identity, socket)

    return network
}