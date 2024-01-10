import type { Network } from "./Network"
import { SyncObjectType } from "../sync/SyncObjectType"
import { Model } from "../sync/Model"
import { Presence } from "../sync/presence/Presence"
import { ConnectionList } from "../sync/presence/ConnectionList"
import { RPCHandler } from "../rpc/RPCHandler"
import { RPCPlugin } from "../rpc/RPCPlugin"
import { Router } from "./Router"
import { AssertPlugin, ConnectionPlugin, Identity } from "../main"
import { User } from "../sync/presence/User"

export type FrameworkOptions<P extends User> = {
    identity: Identity,
    network: Network,
    relay?: boolean,
    userType: SyncObjectType<P>,
    /**
     * @default FrameworkChannels.ConnectionList
     */
    connectionListChannel?: number
}

export enum FrameworkChannels {
    ConnectionList = 31,
    Presence = 30,
    RPC = 29,
    Model = 28,
}

/**
 * Utiliy class for initializing a networked application
 */
export class Framework<P extends User> {

    readonly network: Network
    readonly router: Router
    readonly connectionList: ConnectionList
    readonly presence: Presence<P>
    readonly rpcHandler: RPCHandler
    readonly model: Model

    constructor(options: FrameworkOptions<P>) {
        this.network = options.network

        this.router = new Router({
            network: options.network,
            identity: options.identity,
            relay: options.relay
        })

        this.rpcHandler = new RPCHandler(
            this.router.self,
            this.router.channel(FrameworkChannels.RPC)
        )

        const connectionListChannel = options.connectionListChannel ??
            FrameworkChannels.ConnectionList

        this.connectionList = ConnectionList.client(this.router.channel(connectionListChannel))

        this.model = new Model({
            channel: this.router.channel(FrameworkChannels.Model),
            identity: this.router.identity
        })
            .addPlugin(new RPCPlugin(this.rpcHandler))
            .addPlugin(new ConnectionPlugin(this.connectionList))
            .addPlugin(new AssertPlugin(options.identity))

        this.presence = new Presence({
            channel: this.router.channel(FrameworkChannels.Presence),
            identity: this.router.identity,
            connectionList: this.connectionList,
            type: options.userType
        })

        this.presence.model
            .addPlugin(new RPCPlugin(this.rpcHandler))
            .addPlugin(new AssertPlugin(options.identity))
        // Already added in Presence constructor
        // .addPlugin(new ConnectionPlugin(this.connectionList))
    }

}