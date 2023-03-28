import { test } from "@jest/globals";
import { expect } from "chai";
import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Router } from "../core/Router";
import { FlatNetwork } from "./FlatNetwork";

function waitMessage(router: Router): Promise<{ message: Message, channel: number }> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject("Timeout"), 1000)
        router.emitter().once('message', ({ message, channel }) => {
            clearTimeout(timeout)
            resolve({ message, channel })
        })
    })
}

test("Router", async () => {
    const [host, client1, _client2] = FlatNetwork
        .star(2)
        .map(network => new Router(network.id(), network))

    const wait = waitMessage(client1)
    host.send(Address.to(client1.id()), 0, { name: "orange" })
    const { channel, message } = await wait;
    
    expect(channel).to.equal(0)
    expect(message.originId).to.equal(host.id())
    expect(message.data.name).to.equal("orange")
})