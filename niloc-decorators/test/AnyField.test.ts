import { SyncObject, Template } from "niloc-core"
import { describe, expect, it } from "vitest"
import { field } from "../lib/fields/main"

describe("Test", () => {

    it('Should work ?', () => {

        class Sub extends SyncObject {

            public static template = Template.create("Sub", Sub)

            @field.any("armand")
            name!: string
        }

        class Test extends SyncObject {

            @field.any(3)
            age!: number

            @field.syncObject(Sub.template)
            sub: Sub

            @field.syncObjectRef(null)
            subEmpty: Sub | null

        }

        const test = new Test("a", "Test")

        expect(test.age).to.equal(3)
        expect(test.sub.name).to.equal("armand")
        expect(test.subEmpty).to.equal(null)

    })

})