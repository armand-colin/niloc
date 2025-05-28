import { Duration } from "../lib/main"
import { describe, expect, it } from "vitest"

describe('Duration', () => {

    it("Should create durations raw", () => {
        const durationA = Duration.fromMilliseconds(1000)
        const durationB = Duration.fromMilliseconds(2000)
        const durationC = Duration.fromMilliseconds(1000)

        expect(Duration.equals(durationA, durationB)).to.be.false
        expect(Duration.equals(durationA, durationC)).to.be.true
    })

    it("Should handle seconds", () => {
        const duration = Duration.fromSeconds(34)

        expect(Duration.seconds(duration)).equal(34)
    })

    it("Should handle minutes", () => {
        const duration = Duration.fromMinutes(12)

        expect(Duration.minutes(duration)).equal(12)
        expect(Duration.seconds(duration)).equal(12 * 60)
    })

    it("Should handle hours", () => {
        const duration = Duration.fromHours(4)

        expect(Duration.hours(duration)).equal(4)
    })

    it("Should handle days", () => {
        const duration = Duration.fromDays(31)

        expect(Duration.days(duration)).equal(31)
    })

    it("Should handle split", () => {
        const duration = Duration.fromSplit({
            days: 1,
            seconds: 34,
            hours: 2,
            milliseconds: 34
        })

        const split = Duration.split(duration)
        
        expect(split.days).to.equal(1)
        expect(split.seconds).to.equal(34)
        expect(split.hours).to.equal(2)
        expect(split.milliseconds).to.equal(34)
    })

})