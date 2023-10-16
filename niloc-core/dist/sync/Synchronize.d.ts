export interface ChangeRequester {
    change(fieldIndex: number): void;
    send(): void;
    delete(): void;
}
