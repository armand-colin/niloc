import { ConnectionList, ConnectionPlugin, Model, Presence, RPCHandler, Router, SendLoopPlugin } from "@niloc/core"
import { SocketIONetwork } from "@niloc/socketio-client"
import { io } from "socket.io-client"
import { Channel } from "./Channel"
import { User } from "./User"

type Options = {
    socketioUrl: string
    peerId: string
    roomId: string
    host: boolean
    name: string
}

export class Framework {

    readonly router: Router
    readonly presence: Presence<User>
    readonly model: Model
    readonly rpcHandler: RPCHandler

    constructor(options: Options) {
        const socket = io(options.socketioUrl, {
            query: {
                roomId: options.roomId,
                peerId: options.peerId,
                host: options.host,
                presence: Channel.ConnectionList
            }
        })

        const network = new SocketIONetwork(socket)
        const router = new Router({ id: options.peerId, network, host: options.host, relay: true })

        const connectionList = ConnectionList.client(router.channel(Channel.ConnectionList))

        const presence = new Presence({
            channel: router.channel(Channel.Presence),
            connectionList,
            context: router.context(),
            type: User
        })

        presence.user().name = options.name

        const model = new Model({
            context: router.context(),
            channel: router.channel(Channel.Model)
        })

        model.plugin(new ConnectionPlugin(connectionList))

        const rpcHandler = new RPCHandler(router.self(), router.channel(Channel.RPC))

        this.router = router
        this.model = model
        this.presence = presence
        this.rpcHandler = rpcHandler

        this.router.channel(Channel.ConnectionList).addListener(e => console.log("CL", e))
        connectionList.emitter().on('connected', e => console.log("connected", e))
        this.router.channel(Channel.Presence).addListener(e => console.log('PR', e))

        this.presence.model()
            .plugin(new SendLoopPlugin({ frequency: 100, tolerance: 3 }))
    }

    destroy() { }

}