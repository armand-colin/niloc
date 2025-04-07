export type FormError = {
    name: string;
    type: FormError.Type;
    message?: string;
};
export declare namespace FormError {
    enum Type {
        Missing = "missing",
        Invalid = "invalid"
    }
    function invalid(name: string): FormError;
    function missing(name: string): FormError;
}
