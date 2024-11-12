import { describe, expect, it } from "vitest";
import { field, SyncObject } from "../../lib/main";

describe("Something", () => {

    it("Should do", () => {
        class Test extends SyncObject {

            @field.string("Toto")
            name!: string

        }

        const t = new Test("rr")
        expect(t.name).to.equal("Toto")
    })

})