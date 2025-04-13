import { Result } from "../result/Result"
import { type ZodType } from "zod"

export interface FieldType<T> {
    parse(data: FormDataEntryValue): Result<T | null, void>
    serialize(value: T): FormDataEntryValue
}

type StringTypeOptions = {
    minLength?: number,
    maxLength?: number,
    pattern?: RegExp,
    allowedValues?: string[],
    blockedValues?: string[],
    trim?: boolean,
    case?: "lower" | "upper",
    validator?: (value: string) => boolean
}

class StringType implements FieldType<string> {

    constructor(readonly opts: StringTypeOptions) { }

    parse(data: FormDataEntryValue): Result<string | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        if (this.opts.trim)
            data = data.trim()

        switch (this.opts.case) {
            case "lower": {
                data = data.toLowerCase()
                break
            }
            case "upper": {
                data = data.toUpperCase()
                break
            }
        }

        if (
            this.opts.minLength !== undefined &&
            data.length < this.opts.minLength
        )
            return Result.error(undefined)

        if (
            this.opts.maxLength !== undefined &&
            data.length > this.opts.maxLength
        )
            return Result.error(undefined)

        if (
            this.opts.pattern !== undefined &&
            !this.opts.pattern.test(data)
        )
            return Result.error(undefined)

        if (this.opts.allowedValues && !this.opts.allowedValues.includes(data))
            return Result.error(undefined)

        if (this.opts.blockedValues && this.opts.blockedValues.includes(data))
            return Result.error(undefined)

        if (this.opts.validator && !this.opts.validator(data))
            return Result.error(undefined)

        // Coercing "" to null
        return Result.ok(data || null)
    }

    serialize(value: string): FormDataEntryValue {
        return value
    }

}

type FileTypeOpts = {
    minSize?: number,
    maxSize?: number,
    mime?: string | string[],
    extension?: string | string[],
    validator?: (value: File) => boolean
}

class FileType implements FieldType<File> {

    private _extensions: string[] | null
    private _mimes: string[] | null

    constructor(readonly opts: FileTypeOpts) {
        this._extensions = opts.extension ?
            Array.isArray(opts.extension) ?
                opts.extension.map(e => e.toLowerCase()) :
                [opts.extension.toLowerCase()] :
            null

        this._mimes = opts.mime ?
            Array.isArray(opts.mime) ?
                opts.mime.map(m => m.toLowerCase()) :
                [opts.mime.toLowerCase()] :
            null
    }

    static getExtension(filename: string): string {
        const dotIndex = filename.lastIndexOf(".")
        return filename.slice(dotIndex + 1).toLowerCase()
    }

    parse(data: FormDataEntryValue): Result<File | null, void> {
        if (typeof data === "string")
            return Result.error(undefined)

        if (data.size === 0)
            return Result.ok(null)

        if (this.opts.minSize !== undefined && data.size < this.opts.minSize)
            return Result.error(undefined)

        if (this.opts.maxSize !== undefined && data.size > this.opts.maxSize)
            return Result.error(undefined)

        if (this._extensions) {
            const extension = FileType.getExtension(data.name)
            if (!this._extensions.includes(extension))
                return Result.error(undefined)
        }

        if (this._mimes) {
            if (!this._mimes.includes(data.type.toLowerCase()))
                return Result.error(undefined)
        }

        if (this.opts.validator && !this.opts.validator(data))
            return Result.error(undefined)

        return Result.ok(data)
    }

    serialize(value: File): FormDataEntryValue {
        return value
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

    serialize(value: T): FormDataEntryValue {
        return JSON.stringify(value)
    }

}

type DateTypeOpts = {
    minDate?: Date,
    maxDate?: Date,
    validator?: (date: Date) => boolean
}

class DateType implements FieldType<Date> {

    constructor(readonly opts: DateTypeOpts) { }

    parse(data: FormDataEntryValue): Result<Date | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        const date = new Date(data)
        if (isNaN(date as any)) // Checking for invalid date
            return Result.error(undefined)

        return Result.ok(date)
    }

    serialize(value: Date): FormDataEntryValue {
        return value.toISOString()   
    }

}

type NumberTypeOpts = {
    integerOnly?: boolean,
    positiveOnly?: boolean,
    step?: number,
    validator?: (value: number) => boolean
}

class NumberType implements FieldType<number> {

    constructor(readonly opts: NumberTypeOpts) { }

    parse(data: FormDataEntryValue): Result<number | null, void> {
        if (typeof data !== "string")
            return Result.error(undefined)

        const value = Number(data)
        if (isNaN(value) || data === "") // Checking for invalid date
            return Result.error(undefined)

        return Result.ok(value)
    }

    serialize(value: number): FormDataEntryValue {
        return value.toString()   
    }

}


export namespace FieldType {

    export function string(opts?: StringTypeOptions) {
        return new StringType({ ...opts })
    }

    export function file(opts?: FileTypeOpts) {
        return new FileType({ ...opts })
    }

    export function json<T>(schema: ZodType<T>): JSONType<T> {
        return new JSONType(schema)
    }

    export function date(opts?: DateTypeOpts): DateType {
        return new DateType({ ...opts })
    }

    export function number(opts?: NumberTypeOpts) {
        return new NumberType({ ...opts })
    }

    export function custom<T>(opts: { parse: (data: FormDataEntryValue) => T | null, serialize: (value: T) => FormDataEntryValue }): FieldType<T> {
        return {
            parse(data) {
                try {
                    const value = opts.parse(data)
                    return Result.ok(value)
                } catch (e) {
                    return Result.error(undefined)
                }
            },
            serialize: opts.serialize
        }
    }

}