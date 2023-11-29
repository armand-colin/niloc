import type { Network } from "./Network"
import { SyncObjectType } from "../sync/SyncObjectType"
import { Model } from "../sync/Model"
import { Presence } from "../sync/presence/Presence"
import { SyncObject } from "../sync/SyncObject"
import { ConnectionList } from "../sync/presence/ConnectionList"
import { RPCHandler } from "../rpc/RPCHandler"
import { RPCPlugin } from "../rpc/RPCPlugin"
import { Router } from "./Router"
import { ConnectionPlugin } from "../main"

export type FrameworkOptions<P extends SyncObject> = {
    id: string,
    host: boolean,
    relay?: boolean,
    network: Network,
    presenceType: SyncObjectType<P>,
    connectionList?: ConnectionList
}

export enum FrameworkChannels {
    ConnectionList = 31,
    Presence = 30,
    RPC = 29,
    Model = 28,
}

/**
 * Utiliy class for innitilizing a networked application
 */
export class Framework<P extends SyncObject> {

    readonly network: Network
    readonly router: Router
    readonly connectionList: ConnectionList
    readonly presence: Presence<P>
    readonly rpcHandler: RPCHandler
    readonly model: Model

    constructor(options: FrameworkOptions<P>) {
        this.network = options.network

        this.router = new Router({
            id: options.id,
            network: options.network,
            host: options.host,
            relay: options.relay
        })

        this.rpcHandler = new RPCHandler(
            this.router.self(),
            this.router.channel(FrameworkChannels.RPC)
        )

        this.connectionList = options.connectionList ??
            ConnectionList.client(this.router.channel(FrameworkChannels.ConnectionList))

        this.model = new Model({
            channel: this.router.channel(FrameworkChannels.Model),
            context: this.router.context()
        })
        this.model.addPlugin(new RPCPlugin(this.rpcHandler))
        this.model.addPlugin(new ConnectionPlugin(this.connectionList))

        this.presence = new Presence({
            channel: this.router.channel(FrameworkChannels.Presence),
            context: this.router.context(),
            connectionList: this.connectionList,
            type: options.presenceType
        })
        this.presence.model().plugin(new RPCPlugin(this.rpcHandler))
    }

}