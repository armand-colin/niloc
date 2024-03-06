export type Transformer<T, U = T> = {
    map(value: T): U,
    event(value: T, dispatch: (value: U) => void): void
}

export namespace Transformer {

    export function map<T, U>(mapping: (value: T) => U): Transformer<T, U> {
        return {
            map(value: T): U {
                return mapping(value)
            },
            event(value: T, dispatch: (value: U) => void) {
                dispatch(mapping(value))
            }
        }
    }

    export const toString: Transformer<any, string> = map(value => value.toString())

    export function debounce<T>(delayInMilliseconds: number): Transformer<T> {
        let timeout: number | null = null

        return {
            map(value: any): any {
                return value
            },
            event(value: any, dispatch: (value: any) => void) {
                if (timeout !== null)
                    clearTimeout(timeout)

                timeout = setTimeout(() => dispatch(value), delayInMilliseconds, undefined)
            }
        }
    }

    export function throttle<T>(delayInMilliseconds: number): Transformer<T> {
        let lastDispatch: number = 0 - delayInMilliseconds

        let pending: {
            value: T,
            timeout: number
        } | null = null

        return {
            map(value: T): T {
                return value
            },
            event(value: T, dispatch: (value: T) => void) {
                if (pending !== null) {
                    pending.value = value
                    return
                }

                const now = Date.now()

                if (lastDispatch + delayInMilliseconds < now) {
                    lastDispatch = now
                    dispatch(value)
                    return
                }

                pending = {
                    value,
                    timeout: setTimeout(() => {
                        const toDispatch = pending === null ?
                            value :
                            pending.value

                        pending = null
                        lastDispatch = Date.now()
                        
                        dispatch(toDispatch)
                    }, delayInMilliseconds, undefined)
                }
            }
        }
    }

}

export namespace Transformer.Utils {

    export function chain<T, U, V>(a: Transformer<T, U>, b: Transformer<U, V>): Transformer<T, V> {
        return {
            map(value: T): V {
                return b.map(a.map(value))
            },
            event(value: T, dispatch: (value: V) => void) {
                a.event(value, transformed => b.event(transformed, dispatch))
            }
        }
    }

}