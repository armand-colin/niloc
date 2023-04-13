import { describe, it } from 'vitest'
import { Address } from "../lib/core/Address";

describe("Address", () => {
    it("Should make", () => {
        Address.to("host")
        Address.broadcast()
        Address.to("client")
    })
})