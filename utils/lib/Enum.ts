export type Enum<T extends Record<string, string | number>, U> = T & U & {
    values: T[keyof T][],
    keys: (keyof T)[],
    entries: [keyof T, T[keyof T]][],
    /**
     * Check if a value is a valid enum value
     */    
    is(value: unknown): value is T[keyof T],
    /**
     * Parse a value to an enum value
     * @throws {TypeError} if the value is not a valid enum value
     */
    parse(value: unknown): T[keyof T],
    /**
     * Parse a value to an enum value safely
     * @returns {T[keyof T] | null} the enum value or null if the value is not a valid enum value
     */
    parseSafe(value: unknown): T[keyof T] | null,
}

export namespace Enum {
    type ReservedKeys = 'values' | 'keys' | 'entries' | 'is'

    type ForbidReserved<T> =
        (keyof T) & ReservedKeys extends never
        ? T
        : `Reserved enum key: ${keyof T & ReservedKeys & string}`

    type ForbidExtend<T, U> =
        (keyof U) & ReservedKeys extends never ?
        (keyof U) & (keyof T) extends never ?
        U
        : `Forbidden key: ${keyof U & (ReservedKeys | keyof T) & string} (already in the enumerator)`
        : `Reserved enum key: ${keyof U & (ReservedKeys | keyof T) & string}`

    export function create<const T extends Record<string, string | number>, U = {}>(
        enumerator: ForbidReserved<T>,
        extend?: ForbidExtend<T, U>
    ): Enum<T, U> {
        const values = Object.values(enumerator) as T[keyof T][]

        return {
            ...(enumerator as T),
            ...(extend as U),
            values,
            keys: Object.keys(enumerator) as (keyof T)[],
            entries: Object.entries(enumerator) as [keyof T, T[keyof T]][],
            is(value: unknown): value is T[keyof T] {
                return (values as unknown[]).includes(value)
            },
            parse(value: unknown): T[keyof T] {
                for (const v of values)
                    if (value === v)
                        return v

                throw new TypeError(`Invalid enum value: ${value}`)
            },
            parseSafe(value: unknown): T[keyof T] | null {
                for (const v of values)
                    if (value === v)
                        return v

                return null
            },
        } as Enum<T, U>
    }

    export type Infer<E extends Enum<any, any>> = E extends Enum<infer T, infer _U> ? T[keyof T] : never

}