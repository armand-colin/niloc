type Listener<Args extends any[]> = (...args: Args) => void


export interface MPSC<Input extends any[], Output extends any[]> {

    postOutput(...args: Output): void
    addOutputListener(listener: Listener<Output>): void
    removeOutputListener(listener: Listener<Output>): void

    postInput(...args: Input): void
    setInputListener(listener: Listener<Input>): void

}

export class MPSC<Input extends any[], Output extends any[]> implements MPSC<Input, Output> {

    private _inputListener: Listener<Input> | null = null
    private _outputListeners = new Set<Listener<Output>>()

    constructor() { }

    postOutput(...args: Output): void {
        for (const listener of this._outputListeners)
            listener(...args)
    }

    addOutputListener(listener: Listener<Output>): void {
        this._outputListeners.add(listener)
    }

    removeOutputListener(listener: Listener<Output>): void {
        this._outputListeners.delete(listener)
    }


    postInput(...args: Input): void {
        this._inputListener?.(...args)
    }

    setInputListener(listener: Listener<Input>): void {
        this._inputListener = listener
    }

}