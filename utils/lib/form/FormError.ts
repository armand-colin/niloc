export type FormError = {
    name: string,
    type: FormError.Type,
    message?: string
}

export namespace FormError {

    export enum Type {
        Missing = "missing",
        Invalid = "invalid"
    }

    export function invalid(name: string): FormError {
        return {
            name,
            type: Type.Invalid
        }
    }

    export function missing(name: string): FormError {
        return {
            name,
            type: Type.Missing
        }
    }

}