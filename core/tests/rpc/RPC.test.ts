import { describe, expect, it } from "vitest";
import { MockChannels } from "../channel/MockChannels";
import { RPCHandler } from "../../lib/rpc/RPCHandler"
import { RPC } from "../../lib/rpc/RPC";
import { RPCPlugin } from "../../lib/rpc/RPCPlugin";
import { MockModel } from "../sync/MockModel";
import { SyncObject } from "../../lib/main";
import { MockPeers } from "../MockPeers";

describe('RPC', () => {

    it("Should handle rpc correctly", async () => {
        const [channelA, channelB] = MockChannels.bounded()
        const [peerA, peerB] = MockPeers.make(["a", "b"])
        const handlerA = new RPCHandler(peerA.identity, channelA)
        const handlerB = new RPCHandler(peerB.identity, channelB)

        let response: string = ""

        function rpc(id: string) {
            return RPC.target("a", (count: number) => {
                response = id + count
            })
        }

        const rpcA = rpc('a')
        const rpcB = rpc('b')

        handlerA.register(rpcA, "rpc")
        handlerB.register(rpcB, "rpc")

        // rpcA.call(0);
        // expect(response).to.equal('a0')

        // rpcA.call(10);
        // expect(response).to.equal('a10')

        // rpcB.call(0);
        // expect(response).to.equal('a0')
    })

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
        const [channelA, channelB] = MockModel.channels('a', 'b')
        const [modelA, modelB] = MockModel.models([Avatar])
        const [peerA, peerB] = MockPeers.make(["a", "b"])
        
        const rpcHandlerA = new RPCHandler(peerA.identity, channelA)
        const rpcHandlerB = new RPCHandler(peerB.identity, channelB)

        modelA.addPlugin(new RPCPlugin(rpcHandlerA))
        modelB.addPlugin(new RPCPlugin(rpcHandlerB))

        const avatarA = modelA.instantiate(Avatar, 'avatarA')
        avatarA.isHost = true
        modelA.send()

        {
            const avatarA = modelB.get<Avatar>("avatarA")!
            expect(avatarA).not.to.be.null;
            avatarA.ping.call()
        }

        expect(avatarA.received).to.equal("pong")
    })

})