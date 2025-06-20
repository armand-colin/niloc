import { ParamValue } from "./ParamValue"

export class ColumnType<T extends ParamValue = ParamValue, Optionnal extends boolean = false> {

    // @ts-ignore
    private _mark: T

    constructor(mark: T) {
        this._mark = mark
    }

}

export namespace ColumnType {

    export type Type<C extends ColumnType> = C extends ColumnType<infer U> ? U : never

    export const Number = new ColumnType<number>(0)
    export const String = new ColumnType<string>("")
    export const Date = new ColumnType<Date>(new globalThis.Date())

}