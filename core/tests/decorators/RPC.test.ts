import { Emitter, Identity, Model, Network, NetworkEvents, Peer, RPCHandler, RPCPlugin, Router, SyncObject, rpc } from "../../lib/main"
import { describe, it } from "vitest"

class MockNetwork extends Network {

    *peers(): Iterable<Peer> { }

}

describe("RPC", () => {

    it('Should work ?', () => {

        class Test extends SyncObject {

            temp = 0

            @rpc.owner()
            testOwn() {
                this.temp += 1 
            }

            @rpc.all()
            testAll() {
                this.temp += 1 
            }

            @rpc.broadcast()
            testBroadcast() {
                this.temp += 1 
            }
        }

        const router = new Router({
            identity: new Identity("a"),
            network: new MockNetwork()
        })

        const model = new Model({
            channel: router.channel(0),
            identity: router.identity
        })

        const rpcHandler = new RPCHandler(router.identity, router.channel(1))

        model.addPlugin(new RPCPlugin(rpcHandler))
        model.addType(Test)

        const test = model.instantiate(Test, "a")

        // test.testOwn()
        // expect(test.temp).to.equal(1)

        // test.testAll()
        // expect(test.temp).to.equal(2)

        // test.testBroadcast()
        // expect(test.temp).to.equal(2)
    })

})