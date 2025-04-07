import { Result } from "../result/Result";
import { FieldDescriptor } from "./FieldDescriptor";
import { FieldType } from "./FieldType";
import { FormError } from "./FormError";
type FieldOpts<T = unknown> = {
    type: FieldType<T>;
    required?: boolean;
    multiple?: boolean;
};
type TypeOf<T> = T extends {
    type: FieldType<infer U>;
} ? U : never;
type IsRequired<T> = T extends {
    required: infer U;
} ? U extends boolean ? U : false : false;
type IsMultiple<T> = T extends {
    multiple: infer U;
} ? U extends boolean ? U : false : false;
type Schema = Record<string, FieldOpts>;
type Fields<S extends Schema> = {
    [K in keyof S]: FieldDescriptor<TypeOf<S[K]>, IsRequired<S[K]>, IsMultiple<S[K]>>;
};
type _Parsed<S extends Schema> = {
    [K in keyof S]: FieldDescriptor.Parsed<TypeOf<S[K]>, IsRequired<S[K]>, IsMultiple<S[K]>>;
};
type Unpack<T> = T extends object ? {
    [K in keyof T]: Unpack<T[K]>;
} : T;
type Parsed<S extends Schema> = Unpack<_Parsed<S>>;
export declare class FormDescriptor<S extends Schema> {
    readonly fields: Fields<S>;
    constructor(schema: S);
    parse(data: FormData): Result<Parsed<S>, FormError>;
}
export {};
