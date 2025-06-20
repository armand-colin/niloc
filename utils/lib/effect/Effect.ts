import { Result } from "../main";


export namespace Effect {

    export type Factory<Success, Error> = () => AsyncGenerator<Effect<unknown, unknown>, Result<Success, Error>>

    export type Effect<Success, Error> = {
        factory: Factory<Success, Error>
    }

    export function create<Success = unknown, Error = unknown>(factory: Factory<Success, Error>): Effect<Success, Error> {
        return { factory }
    }

    export async function run<Success = unknown, Error = unknown>(effect: Effect<Success, Error>): Promise<Result<Success, Error>> {
        const generator = effect.factory()

        while (true) {
            const result = await generator.next()

            if (result.done) {
                return result.value
            } else {
                await run(result.value)
            }
        }
    }

    export function promise<T, E = unknown>(promise: Promise<T> | (() => Promise<T>)): Effect<T, E> {
        return create(async function* () {
            if (typeof promise === "function")
                promise = promise()

            try {
                const result = await promise
                return success(result)
            } catch (e) {
                return error(e as E)
            }
        })
    }

    export function map<Success, Error, Success2>(effect: Effect<Success, Error>, mapper: (value: Success) => Success2): Effect<Success2, Error> {
        return {
            factory: async function* () {
                const generator = effect.factory()

                while (true) {
                    const result = await generator.next()

                    if (result.done) {
                        if (result.value.ok) {
                            return success(mapper(result.value.value))
                        } else {
                            return result.value
                        }
                    } else {
                        await run(result.value)
                    }
                }
            }
        }
    }

    export function success<T>(value: T): Result.Ok<T> {
        return Result.ok(value)
    }

    export function error<E>(error: E): Result.Error<E> {
        return Result.error(error)
    }

}