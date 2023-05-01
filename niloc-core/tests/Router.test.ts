import { expect } from "chai";
import { Address } from "../lib/core/Address";
import { Message } from "../lib/core/Message";
import { Router } from "../lib/core/Router";
import { FlatNetwork } from "./FlatNetwork";
import { describe, it } from "vitest";

function waitMessage(router: Router, channel: number): Promise<Message> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject("Timeout"), 1000)

        function callback(message: any) {
            resolve(message)
            clearTimeout(timeout)
            router.channel(channel).removeListener(callback)
        }

        router.channel(channel).addListener(callback)
    })
}

describe("Router", () => {

    it("Should create star", async () => {
        const [host, client1, _client2] = FlatNetwork
            .star(2)
            .map(network=> new Router({ id: network.id(), network }))

        const wait = waitMessage(client1, 0)

        console.log("c1addr", client1.address())
        host.channel(0).post(client1.address(), { name: "orange" })

        const message = await wait;

        expect(message.originId).to.equal(host.id())
        expect(message.data.name).to.equal("orange")
    })

})