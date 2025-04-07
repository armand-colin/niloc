import { Result } from "../result/Result";
import { FieldType } from "./FieldType";
import { FormError } from "./FormError";

type Opts<T, Required extends boolean, Multiple extends boolean> = {
    type: FieldType<T>,
    name: string,
    required: Required,
    multiple: Multiple
}

export class FieldDescriptor<T, Required extends boolean, Multiple extends boolean> {

    readonly name: string
    readonly type: FieldType<T>
    readonly multiple: Multiple
    readonly required: Required

    constructor(opts: Opts<T, Required, Multiple>) {
        this.name = opts.name
        this.type = opts.type
        this.required = opts.required
        this.multiple = opts.multiple
    }

    parse(data: FormData): Result<
        FieldDescriptor.Parsed<T, Required, Multiple>,
        FormError
    > {
        let value: Result<FieldDescriptor.Parsed<T, Required, Multiple>, void>
        if (this.multiple) {
            const entries = data.getAll(this.name)
            const values = []

            for (const entry of entries) {
                const parsed = this.type.parse(entry)
                if (!parsed.ok) {
                    value = Result.error(undefined)
                    break
                }
                values.push(parsed.value)
            }

            value = Result.ok(values as FieldDescriptor.Parsed<T, Required, Multiple>)
        } else {
            const entry = data.get(this.name)
            if (entry === null) {
                value = Result.ok(null as FieldDescriptor.Parsed<T, Required, Multiple>)
            } else {
                value = this.type.parse(entry) as Result<FieldDescriptor.Parsed<T, Required, Multiple>, void>
            }
        }

        if (!value.ok)
            return Result.error(FormError.invalid(this.name))

        if (this.required && value.value === null)
            return Result.error(FormError.missing(this.name))

        return Result.ok(value.value as FieldDescriptor.Parsed<T, Required, Multiple>)
    }

}

export namespace FieldDescriptor {

    export type Parsed<T, Required extends boolean, Multiple extends boolean> =
        Required extends true ?
        Multiple extends true ?
        T[] :
        T :
        Multiple extends true ?
        T[] :
        T | null

}