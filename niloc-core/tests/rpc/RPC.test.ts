import { describe, expect, it } from "vitest";
import { MockChannels } from "../channel/MockChannels";
import { RPCHandler } from "../../lib/rpc/RPCHandler"
import { RPC } from "../../lib/rpc/RPC";

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

})