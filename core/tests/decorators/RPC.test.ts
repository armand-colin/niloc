import { Emitter, Identity, Message, Model, Network, RPCHandler, RPCPlugin, Router, SyncObject, rpc } from "../../lib/main"
import { describe, it } from "vitest"

class MockNetwork implements Network {

    onMessage() { }
    send(channel: number, message: Message): void { }

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
    })

})