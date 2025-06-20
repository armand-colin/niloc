import { ParamValue } from "./ParamValue";
export declare class ColumnType<T extends ParamValue = ParamValue, Optionnal extends boolean = false> {
    private _mark;
    constructor(mark: T);
}
export declare namespace ColumnType {
    type Type<C extends ColumnType> = C extends ColumnType<infer U> ? U : never;
    const Number: ColumnType<number, false>;
    const String: ColumnType<string, false>;
    const Date: ColumnType<Date, false>;
}
