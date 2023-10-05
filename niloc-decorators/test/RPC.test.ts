import { Emitter, Model, RPCPlugin, Router, SyncObject, Template } from "@niloc/core"
import { describe, expect, it } from "vitest"
import { rpc, field } from "../lib/main"

describe("RPC", () => {

    it('Should work ?', () => {

        class Test extends SyncObject {

            public static template = Template.create("Test", Test)

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

        model.plugin(new RPCPlugin(router.self(), router.channel(1)))
        model.register(Test.template)

        const test = model.instantiate(Test.template, "a")

        test.testOwn()
        expect(test.temp).to.equal(1)

        test.testAll()
        expect(test.temp).to.equal(2)

        test.testBroadcast()
        expect(test.temp).to.equal(2)
    })

})