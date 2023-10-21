import { Emitter, Model, RPCHandler, RPCPlugin, Router, SyncObject, rpc } from "../../lib/main"
import { describe, expect, it } from "vitest"

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
            id: "a",
            network: {
                emitter() { return new Emitter<any>() },
                *peers() { }
            } 
        })

        const model = new Model({
            channel: router.channel(0),
            context: router.context()
        })

        const rpcHandler = new RPCHandler(router.self(), router.channel(1))

        model.plugin(new RPCPlugin(rpcHandler))
        model.register(Test)

        const test = model.instantiate(Test, "a")

        // test.testOwn()
        // expect(test.temp).to.equal(1)

        // test.testAll()
        // expect(test.temp).to.equal(2)

        // test.testBroadcast()
        // expect(test.temp).to.equal(2)
    })

})