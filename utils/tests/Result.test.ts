import { describe, expect, it } from "vitest"
import { Result } from "../lib/main"

describe("Iter", () => {

    it("Should correctly handle results", () => {
        const ok = Result.ok(42)
        expect(ok.unwrap()).toBe(42)

        if (ok.ok) {
            // Shall have access on ok.value
            ok.value
        } else {
            // Shall have access on ok.error
            ok.error
        }

        const mapped = ok.mapOk(x => x * 2)

        expect(mapped.unwrap()).toBe(84)


        const error = Result.error("Failed")
        expect(() => error.unwrap()).toThrow()
    })


})