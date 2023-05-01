import { describe, expect, it } from "vitest";
import { MockChannels } from "../channel/MockChannels";
import { RPCHandler } from "../../lib/rpc/RPCHandler"
import { RPC } from "../../lib/rpc/RPC";
import { RPCPlugin } from "../../lib/rpc/RPCPlugin";
import { MockModel } from "../sync/MockModel";
import { Address, SyncObject, Template } from "../../lib/main";

describe('RPC', () => {

    it("Should handle rpc correctly", async () => {
        const [channelA, channelB] = MockChannels.bounded()
        const handlerA = new RPCHandler("a", Address.to("a"), channelA)
        const handlerB = new RPCHandler("b", Address.to("b"), channelB)

        function rpc(id: string) {
            return RPC.target("a", (count: number): string => {
                return id + count
            })
        }

        const rpcA = rpc('a')
        const rpcB = rpc('b')

        handlerA.register(rpcA, "rpc")
        handlerB.register(rpcB, "rpc")

        expect(await rpcA.call(0)).to.equal('a0')
        expect(await rpcA.call(10)).to.equal('a10')
        expect(await rpcB.call(0)).to.equal('a0')
    })

    class Avatar extends SyncObject {

        static template = Template.create('avatar', Avatar)

        isHost = false

        ping = RPC.target("a", () => {
            if (this.isHost)
                return 'pong'
            throw "Called RPC from peer b"
        })

    }

    it('Should work with a model', async () => {
        const [channelA, channelB] = MockModel.channels('a', 'b')
        const [modelA, modelB] = MockModel.models([Avatar.template])

        modelA.plugin(new RPCPlugin('a', Address.to("a"), channelA))
        modelB.plugin(new RPCPlugin('b', Address.to("b"), channelB))

        const avatarA = modelA.instantiate(Avatar.template, 'avatarA')
        avatarA.isHost = true
        modelA.tick()

        {
            const avatarA = modelB.get<Avatar>("avatarA")!
            expect(avatarA).not.to.be.null;
            expect(await avatarA.ping.call()).to.equal("pong")
        }
    })

})