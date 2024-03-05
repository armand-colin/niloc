import { describe, expect, it } from "vitest"
import { MockModel } from "./MockModel"
import { ArrayField, SyncObject } from "../../lib/main"

describe("ArrayField", () => {
    it("Should sync correcty", () => {

        class Test extends SyncObject {

            readonly values = new ArrayField<number>([])

        }

        const [modelA, modelB] = MockModel.models([Test])

        const objectA = modelA.instantiate(Test, "test")
        modelA.send()

        const objectB = modelB.get("test") as Test

        expect(objectA.values.get()).toEqual([])
        expect(objectB.values.get()).toEqual([])

        objectA.values.set([1, 2, 3])
        objectA.send()

        expect(objectA.values.get()).toEqual([1, 2, 3])
        expect(objectB.values.get()).toEqual([1, 2, 3])
        
        objectA.values.push(4)
        objectA.send()

        expect(objectA.values.get()).toEqual([1, 2, 3, 4])
        expect(objectB.values.get()).toEqual([1, 2, 3, 4])
    })
})