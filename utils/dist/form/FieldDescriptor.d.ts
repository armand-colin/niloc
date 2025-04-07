import { Result } from "../result/Result";
import { FieldType } from "./FieldType";
import { FormError } from "./FormError";
type Opts<T, Required extends boolean, Multiple extends boolean> = {
    type: FieldType<T>;
    name: string;
    required: Required;
    multiple: Multiple;
};
export declare class FieldDescriptor<T, Required extends boolean, Multiple extends boolean> {
    readonly name: string;
    readonly type: FieldType<T>;
    readonly multiple: Multiple;
    readonly required: Required;
    constructor(opts: Opts<T, Required, Multiple>);
    parse(data: FormData): Result<FieldDescriptor.Parsed<T, Required, Multiple>, FormError>;
}
export declare namespace FieldDescriptor {
    type Parsed<T, Required extends boolean, Multiple extends boolean> = Required extends true ? Multiple extends true ? T[] : T : Multiple extends true ? T[] : T | null;
}
export {};
