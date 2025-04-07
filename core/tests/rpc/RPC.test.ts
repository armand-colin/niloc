import { describe, expect, it } from "vitest";
import { RPCHandler } from "../../lib/rpc/RPCHandler"
import { RPC } from "../../lib/rpc/RPC";
import { RPCPlugin } from "../../lib/rpc/RPCPlugin";
import { MockModel } from "../sync/MockModel";
import { SyncObject } from "../../lib/main";
import { MockPeers } from "../MockPeers";
import { Mock } from "../Mock";

describe('RPC', () => {

    class Avatar extends SyncObject {

        isHost = false

        received: string = "nothing"

        ping = RPC.target("a", () => {
            if (this.isHost) {
                this.received = "pong"
                return
            }

            throw "Called RPC from peer b"
        })

    }

    it('Should work with a model', async () => {
        const [a, b] = Mock.pair()

        const channelA = a.router.channel(0)
        const channelB = b.router.channel(0)

        a.model.addType(Avatar)
        b.model.addType(Avatar)
        
        const rpcHandlerA = new RPCHandler(a.identity, channelA)
        const rpcHandlerB = new RPCHandler(b.identity, channelB)

        a.model.addPlugin(new RPCPlugin(rpcHandlerA))
        b.model.addPlugin(new RPCPlugin(rpcHandlerB))

        const avatarA = a.model.instantiate(Avatar, 'avatarA')
        avatarA.isHost = true
        a.model.send()

        {
            const avatarA = b.model.get<Avatar>("avatarA")!
            expect(avatarA).not.to.be.null;
            avatarA.ping.call()
        }

        expect(avatarA.received).to.equal("pong")
    })

})