import { Result } from "../main";

export namespace Effect {

    type Context = {

    }

    export type Factory<Success, Error> = (context: Context) => AsyncGenerator<Effect<unknown, unknown>, Result<Success, Error>>

    export type Effect<Success, Error> = {
        factory: Factory<Success, Error>
    }

    export function create<Success = unknown, Error = unknown>(factory: Factory<Success, Error>): Effect<Success, Error> {
        return { factory }
    }

    function createContext(): Context {
        return {

        }
    }

    export async function run<Success = unknown, Error = unknown>(effect: Effect<Success, Error>, context?: Context): Promise<Result<Success, Error>> {
        context = context ?? createContext()

        const generator = effect.factory(context)

        while (true) {
            const result = await generator.next()

            if (result.done) {
                return result.value
            } else {
                await run(result.value, context)
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
            factory: async function* (context) {
                const generator = effect.factory(context)

                while (true) {
                    const result = await generator.next()

                    if (result.done) {
                        if (result.value.ok) {
                            return success(mapper(result.value.value))
                        } else {
                            return result.value
                        }
                    } else {
                        await run(result.value, context)
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