type Listener<Args extends any[]> = (...args: Args) => void;
export interface MPSC<Input extends any[], Output extends any[]> {
    postOutput(...args: Output): void;
    addOutputListener(listener: Listener<Output>): void;
    removeOutputListener(listener: Listener<Output>): void;
    postInput(...args: Input): void;
    setInputListener(listener: Listener<Input>): void;
}
export declare class MPSC<Input extends any[], Output extends any[]> implements MPSC<Input, Output> {
    private _inputListener;
    private _outputListeners;
    constructor();
}
export {};
