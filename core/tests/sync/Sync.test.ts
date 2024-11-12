import { describe, expect, it } from "vitest";
import { AnyField, BinaryReader, BinaryWriter, Model, SyncObject } from "../../lib/main";

describe("Sync messages", () => {

    function serde(reference: SyncObject, target: SyncObject) {
        const writer = new BinaryWriter()
        SyncObject.write(reference, writer)
        const buffer = writer.collect()

        const reader = new BinaryReader(buffer)
        SyncObject.read(target, reader)
    }

    it("Should read/write sync objects", () => {
        class Test extends SyncObject {
            name = new AnyField<string>("Armand")
            age = new AnyField<number>(21)
        }

        const testReference = new Test("armand")
        testReference.age.set(18)
        testReference.name.set("Colin")

        const testTarget = new Test("armand")

        serde(testReference, testTarget)

        expect(testReference.age.get()).to.equal(testTarget.age.get())
        expect(testReference.name.get()).to.equal(testTarget.name.get())
    })

})