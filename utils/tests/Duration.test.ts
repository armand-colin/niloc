import { Duration } from "../lib/main"
import { describe, expect, it } from "vitest"

describe('Duration', () => {

    it("Should create durations raw", () => {
        const durationA = new Duration(1000)
        const durationB = new Duration(2000)
        const durationC = new Duration(1000)

        expect(durationA.equals(durationB)).to.be.false
        expect(durationA.equals(durationC)).to.be.true
    })

    it("Should handle seconds", () => {
        const duration = Duration.seconds(34)

        expect(duration.seconds).equal(34)
    })

    it("Should handle minutes", () => {
        const duration = Duration.minutes(12)

        expect(duration.minutes).equal(12)
        expect(duration.seconds).equal(12 * 60)
    })

    it("Should handle hours", () => {
        const duration = Duration.hours(4)

        expect(duration.hours).equal(4)
    })

    it("Should handle days", () => {
        const duration = Duration.days(31)

        expect(duration.days).equal(31)
    })

    it("Should handle split", () => {
        const duration = Duration.split({
            days: 1,
            seconds: 34,
            hours: 2,
            milliseconds: 34
        })

        const split = duration.split()
        
        expect(split.days).to.equal(1)
        expect(split.seconds).to.equal(34)
        expect(split.hours).to.equal(2)
        expect(split.milliseconds).to.equal(34)
    })

})