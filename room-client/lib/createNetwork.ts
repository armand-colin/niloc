import { FrameworkChannels, Identity, Network } from '@niloc/core'
import io from "socket.io-client"
import { SocketIONetwork } from './SocketIONetwork'

export function createNetwork(options: {
    url: string,
    identity: Identity,
    roomId: string,
    /**
     * @default `FrameworkChannels.ConnectionList`. If the value is `null`, 
     * the connection list will not be sent.
     */
    connectionListChannel?: number | null
}): Network {
    const socket = io(options.url, {
        query: {
            userId: options.identity.userId,
            isHost: options.identity.host,
            roomId: options.roomId,
            presence: options.connectionListChannel === null ?
                undefined :
                options.connectionListChannel ?? FrameworkChannels.ConnectionList
        }
    })

    const network = new SocketIONetwork(options.identity.userId, socket)

    return network
}
