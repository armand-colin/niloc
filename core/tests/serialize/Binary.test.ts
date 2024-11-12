import { BinaryReader, BinaryWriter } from "../../lib/main"
import { describe, expect, it } from "vitest"

describe("Binary read / write", () => {

    it("Should read / write booleans", () => {
        const writer = new BinaryWriter()

        writer.writeBoolean(true)
        writer.writeBoolean(false)
        writer.writeBoolean(false)
        writer.writeBoolean(false)
        writer.writeBoolean(true)

        const buffer = writer.collect()

        expect(buffer.byteLength).to.equal(5)
        expect(writer.cursor()).to.equal(0)

        const reader = new BinaryReader()
        reader.feed(buffer)

        expect(reader.readBoolean()).to.equal(true)
        expect(reader.readBoolean()).to.equal(false)
        expect(reader.readBoolean()).to.equal(false)
        expect(reader.readBoolean()).to.equal(false)
        expect(reader.readBoolean()).to.equal(true)

        expect(reader.empty()).to.be.true
    })

    it("Should read / write integers", () => {
        const writer = new BinaryWriter()

        writer.writeU8(3)
        writer.writeU16(1735)
        writer.writeU32(2176349)
        writer.writeU64(981672347613561)

        writer.writeI8(-3)
        writer.writeI16(-1735)
        writer.writeI32(-2176349)
        writer.writeI64(-981672347613561)

        const buffer = writer.collect()

        expect(writer.cursor()).to.equal(0)

        const reader = new BinaryReader()
        reader.feed(buffer)

        expect(reader.readU8()).to.equal(3)
        expect(reader.readU16()).to.equal(1735)
        expect(reader.readU32()).to.equal(2176349)
        expect(reader.readU64()).to.equal(981672347613561n)

        expect(reader.readI8()).to.equal(-3)
        expect(reader.readI16()).to.equal(-1735)
        expect(reader.readI32()).to.equal(-2176349)
        expect(reader.readI64()).to.equal(-981672347613561n)

        expect(reader.empty()).to.be.true
    })

    function equalWithTolerance(a: number, b: number, tolerance: number) {
        return Math.abs(a - b) < tolerance
    }

    it("Should read / write floats", () => {
        const writer = new BinaryWriter()

        writer.writeF32(3.14)
        writer.writeF64(3.141592653589793)

        const buffer = writer.collect()

        expect(writer.cursor()).to.equal(0)

        const reader = new BinaryReader()
        reader.feed(buffer)

        expect(equalWithTolerance(reader.readF32(), 3.14, 0.0001)).to.be.true
        expect(reader.readF64()).to.equal(3.141592653589793)

        expect(reader.empty()).to.be.true
    })

    it("Should read / write strings", () => {
        const writer = new BinaryWriter()

        writer.writeString("Hello World")
        writer.writeString("World")

        const buffer = writer.collect()

        expect(writer.cursor()).to.equal(0)

        const reader = new BinaryReader()
        reader.feed(buffer)

        expect(reader.readString()).to.equal("Hello World")
        expect(reader.readString()).to.equal("World")

        expect(reader.empty()).to.be.true
    })


    it("Should handle array offsets (read)", () => {
        const origin = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

        {
            const buffer = origin.subarray(2, 5)
            const reader = new BinaryReader(buffer)

            expect(reader.readU8()).to.equal(2)
            expect(reader.readU8()).to.equal(3)
            expect(reader.readU8()).to.equal(4)
            expect(reader.empty()).to.be.true
        }

        {
            const reader = new BinaryReader(origin)
            reader.setCursor(3)
            const buffer = reader.read(4)
            const reader2 = new BinaryReader(buffer)
            expect(reader2.readU8()).to.equal(3)
            expect(reader2.readU8()).to.equal(4)
            expect(reader2.readU8()).to.equal(5)
            expect(reader2.readU8()).to.equal(6)
            expect(reader2.empty()).to.be.true
        }
    })

})