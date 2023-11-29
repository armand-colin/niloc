import { Provider } from "../lib/main"
import { describe, it, expect } from "vitest"

describe("Provider", () => {
    it("Should build simple case", () => {
        class Simple { }

        const provider = new Provider()

        const simple = provider.get(Simple)
        expect(!!simple).to.be.true;
    })

    it("Should build hierarchy case", () => {
        class A { }

        class B {
            constructor(
                provider: Provider,
                readonly a = provider.get(A)
            ) { }
        }

        const provider = new Provider()

        const a = provider.get(A)
        const b = provider.get(B)

        expect(!!a).to.be.true;
        expect(!!b).to.be.true;
    })

    it("Should fail on loops", () => {
        class A {
            constructor(
                provider: Provider,
                readonly c = provider.get(B)
            ) { }
        }

        class B {
            constructor(
                provider: Provider,
                readonly b = provider.get(A)
            ) { }
        }

        const provider = new Provider()

        expect(() => {
            provider.get(A)
        }).to.throw()
    })

    it("Should handle mocking", () => {
        class A { }

        class AMock { }

        const provider = new Provider()
        provider.set(A, new AMock())

        const a = provider.get(A)
        expect(a).to.be.instanceOf(AMock)
    })
})