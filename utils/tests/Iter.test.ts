import { Iter } from "../lib/main"
import { describe, expect, it } from "vitest"

describe("Iter", () => {

    it("Should build iter and collect correctly", () => {
        const iter = Iter.from([1, 2, 3, 4, 5])

        const result = iter.collect()

        expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it("Should filter", () => {
        const iter = Iter.from([1, 2, 3, 4, 5])
            .filter(x => !!(x % 2))

        const result = iter.collect()

        expect(result).toEqual([1, 3, 5])
    })

    it("Should map", () => {
        const iter = Iter.from([1, 2, 3, 4, 5])
            .map(x => x * 2)

        const result = iter.collect()

        expect(result).toEqual([2, 4, 6, 8, 10])
    })

    it("Should iterate", () => {
        const array = [1, 2, 3, 4, 5]
        const iter = Iter.from(array)

        let i = 0
        for (const value of iter)
            expect(value).toBe(array[i++])
    })

    it("Should zip", () => {
        const array1 = [1, 2, 3, 4, 5]
        const array2 = [-1, -2, -3, -4, -5]

        const iter = Iter.zip(array1, array2)

        let i = 0
        for (const [a, b] of iter) {
            expect(a).toBe(array1[i])
            expect(b).toBe(array2[i])
            i++
        }
    })

})