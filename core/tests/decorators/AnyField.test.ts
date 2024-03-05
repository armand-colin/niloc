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

            @field.number(3)
            mark: number

            @field.float(3)
            x: number

            @field.integer(3)
            i: number

            @field.string("armand")
            name: string

            @field.boolean()
            died: boolean

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