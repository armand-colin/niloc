import { describe, it, expect } from "vitest";
import { AssertHandler, Identity, assert } from "../../lib/main"

describe("Assert", () => {

    class Test {

        @assert.host()
        test() {
            return true
        }

    }

    it("Should assert for host when not host", () => {
        const identity = new Identity("me", false)
        const handler = new AssertHandler(identity)
        const test = new Test()

        handler.infuse(test)

        expect(() => test.test()).to.throw()
    })

    it("Should not assert for host when host", () => {
        const identity = new Identity("me", true)
        const handler = new AssertHandler(identity)
        const test = new Test()

        handler.infuse(test)

        expect(() => test.test()).not.to.throw()
    })

    it("Should be compatible with other decorators", () => {
        // TODO
    })

    it("Should work with plugin", () => {
        // TODO
    })

})