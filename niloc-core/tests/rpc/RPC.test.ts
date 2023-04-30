import { describe, expect, it } from "vitest";
import { MockChannels } from "../channel/MockChannels";
import { RPCHandler } from "../../lib/rpc/RPCHandler"
import { RPC } from "../../lib/rpc/RPC";
import { RPCPlugin } from "../../lib/rpc/RPCPlugin";
import { MockModel } from "../sync/MockModel";
import { SyncObject, Template } from "../../lib/main";

describe('RPC', () => {

    it("Should handle rpc correctly", async () => {
        const [channelA, channelB] = MockChannels.bounded()
        const handlerA = new RPCHandler("a", channelA)
        const handlerB = new RPCHandler("b", channelB)

        function rpc(id: string) {
            return new RPC((count: number): string => {
                return id + count
            }, "a")
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

        ping = new RPC(() => {
            if (this.isHost)
                return 'pong'
            throw "Called RPC from peer b"
        }, 'a')

    }

    it('Should work with a model', async () => {
        const [channelA, channelB] = MockModel.channels('a', 'b')
        const [modelA, modelB] = MockModel.models([Avatar.template])

        modelA.plugin(new RPCPlugin('a', channelA))
        modelB.plugin(new RPCPlugin('b', channelB))

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