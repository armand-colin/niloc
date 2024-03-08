import { Observable, Transformer } from "../lib/main"
import { describe, it, expect } from "vitest"

describe("Observable", () => {

    it("Should build simple observable", () => {
        const observable = new Observable(0)

        expect(observable.value).to.equal(0)
    })

    it("Should dispatch changes", () => {
        const observable = new Observable(0)

        let value: number | undefined = undefined

        observable.subscribe(v => value = v)

        expect(value).to.equal(0)

        observable.value = 1

        expect(value).to.equal(1)
    })

    it("Should not dispatch changes when told not to", () => {
        const observable = new Observable(0)

        let value: number | undefined = undefined

        observable.subscribe(v => value = v, false)

        expect(value).to.equal(undefined)

        observable.value = 1

        expect(value).to.equal(1)
    })

    it("Should not dispatch changes after destroy", () => {
        const observable = new Observable(0)

        let value: number | undefined = undefined

        observable.subscribe(v => value = v)
        expect(value).to.equal(0)
        observable.value = 1
        expect(value).to.equal(1)
        observable.destroy()
        observable.value = 2
        expect(value).to.equal(1)
    })

    it("Should not dispatch changes after unsubscribe", () => {
        const observable = new Observable(0)

        let value: number | undefined = undefined

        const subscriber = observable.subscribe(v => value = v)
        expect(value).to.equal(0)

        observable.value = 1
        expect(value).to.equal(1)

        observable.unsubscribe(subscriber)

        observable.value = 2
        expect(value).to.equal(1)
    })

    it("Should handle simple pipe", () => {
        const observable = new Observable(0)

        const piped = observable
            .pipe(Transformer.map(v => v * 2))
            .observable()

        let value: number = 0
        piped.subscribe(v => value = v)

        expect(value).to.equal(0)

        observable.value = 1
        expect(value).to.equal(2)
    })

    it("Should handle pipe chaining", () => {
        const observable = new Observable(0)

        const piped = observable
            .pipe(Transformer.map(v => v * 2))
            .pipe(Transformer.map(v => v + 1))
            .pipe(Transformer.toString)
            .observable()

        let value: string = ""
        piped.subscribe(v => value = v)

        expect(value).to.equal("1")

        observable.value = 1
        expect(value).to.equal("3")
    })

    it("Should handle debounce", async () => {
        const observable = new Observable(0)

        const piped = observable
            .pipe(Transformer.debounce(100))
            .observable()

        let value: number = -1
        piped.subscribe(v => value = v)

        expect(value).to.equal(0)

        observable.value = 1
        expect(value).to.equal(0)

        await piped.next()
        
        expect(value).to.equal(1)
    })

})