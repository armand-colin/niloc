import { Result } from "../main";

export namespace JSON {

    export class ParseError {
        constructor(readonly nativeError: Error) { }
    }

    export function parse<T>(value: string): Result<T, ParseError> {
        try {
            const parsed = JSON.parse(value) as T
            return Result.ok(parsed)
        } catch (e) {
            return Result.error(new ParseError(e as Error))
        }
    }

    export function stringify(value: unknown): string {
        return JSON.stringify(value)
    }

}