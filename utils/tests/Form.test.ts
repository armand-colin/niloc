import { FieldType } from "../lib/form/FieldType"
import { FormDescriptor } from "../lib/main"
import { describe, expect, it } from "vitest"
import zod from "zod"

describe("Form", () => {

    it("Should handle simple forms", () => {
        const descriptor = new FormDescriptor({
            age: {
                type: FieldType.string(),
                required: true
            },
            name: {
                type: FieldType.string({ minLength: 12 }),
            },
            options: {
                type: FieldType.string(),
                multiple: true,
                required: true
            },
            json: {
                type: FieldType.json(zod.object({
                    name: zod.string(),
                    kind: zod.string()
                }))
            }
        })

        const data = new FormData()
        data.append("age", "12")
        data.append("name", "armand le plus beau")
        data.append("options", "a")
        data.append("options", "b")
        data.append("json", JSON.stringify({ name: "toto", kind: "elephant" }))

        const result = descriptor.parse(data)

        expect(result.ok).to.be.true
    })

})