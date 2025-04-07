import { Result } from "../result/Result"
import { type ZodType } from "zod"

export interface FieldType<T> {

    parse(data: FormDataEntryValue): Result<T | null, void>

}

type StringTypeOptions = {
    minLength?: number
}

class StringType implements FieldType<string> {

    private _options: StringTypeOptions

    constructor(options: StringTypeOptions) {
        this._options = options
    }

    parse(data: FormDataEntryValue): Result<string | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        if (
            this._options.minLength !== undefined && 
            data.length < this._options.minLength
        )
            return Result.error(undefined)

        // Coercing "" to null
        return Result.ok(data || null)
    }

}

class FileType implements FieldType<File> {

    parse(data: FormDataEntryValue): Result<File | null, void> {
        if (typeof data === "string")
            return Result.error(undefined)

        if (data.size === 0)
            return Result.ok(null)

        return Result.ok(data)
    }

}

class JSONType<T> implements FieldType<T> {

    constructor(readonly schema: ZodType<T>) { }

    parse(data: FormDataEntryValue): Result<T | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        try {
            const json = JSON.parse(data)
            const result = this.schema.safeParse(json)

            if (!result.success)
                return Result.error(undefined)

            return Result.ok(result.data)
        } catch (e) {
            return Result.error(undefined)
        }
    }

}

class DateType implements FieldType<Date> {

    parse(data: FormDataEntryValue): Result<Date | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        const date = new Date(data)
        if (isNaN(date as any)) // Checking for invalid date
            return Result.error(undefined)

        return Result.ok(date)
    }

}

class NumberType implements FieldType<number> {

    parse(data: FormDataEntryValue): Result<number | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        const value = Number(data)
        if (isNaN(value)) // Checking for invalid date
            return Result.error(undefined)

        return Result.ok(value)
    }

}


export namespace FieldType {

    const baseString = new StringType({})

    export function string(options?: StringTypeOptions) {
        if (!options)
            return baseString

        return new StringType(options)
    }

    export function file() {
        return new FileType()
    }

    export function json<T>(schema: ZodType<T>): JSONType<T> {
        return new JSONType(schema)
    }

    export function date(): DateType {
        return new DateType()
    }

    export function number() {
        return new NumberType()
    }

    export function custom<T>(parseFunction: (data: FormDataEntryValue) => T | null): FieldType<T> {
        return {
            parse(data) {
                try {
                    const value = parseFunction(data)
                    return Result.ok(value)
                } catch (e) {
                    return Result.error(undefined)
                }
            }
        }
    }

}