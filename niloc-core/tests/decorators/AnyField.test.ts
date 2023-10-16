import { describe, expect, it } from "vitest"
import { SyncObject, field } from "../../lib/main"

describe("Test", () => {

    it('Should work ?', () => {

        class Sub extends SyncObject {

            @field.any("armand")
            name: string

        }

        class Test extends SyncObject {

            @field.any(3)
            age: number

            @field.syncObject(Sub)
            sub: Sub

            @field.syncObjectRef(null)
            subEmpty: Sub | null

        }

        const test = new Test("a")

        expect(test.age).to.equal(3)
        expect(test.sub.name).to.equal("armand")
        expect(test.subEmpty).to.equal(null)

    })

})