import { describe, expect, it } from "vitest"
import { MockChannels } from "./MockChannels"
import { Address, Channel, Message } from "../../lib/main"

describe('Channel', () => {

    it("Should test for channel split", () => {
        const [a, b] = MockChannels.bounded()

        const [a1, a2] = Channel.split(a, 2)
        const [b1, b2] = Channel.split(b, 2)

        let a1recv!: Message
        a1.addListener(message => {
            a1recv = message
        })

        b1.post(Address.to('a'), "test")
        expect(a1recv.address).to.deep.equal(Address.to('a'))
        expect(a1recv.data).to.equal("test")

        let b2recv!: Message
        b2.addListener(message => {
            b2recv = message
        })

        a2.post(Address.to('b'), "test")
        expect(b2recv.address).to.deep.equal(Address.to('b'))
        expect(b2recv.data).to.equal("test")
    })

})