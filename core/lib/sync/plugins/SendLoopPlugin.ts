import { Model } from "../Model";
import { Plugin } from "../Plugin";

type Options = {
    /**
     * Frequency of the loop in milliseconds
     * @default 100
     */
    frequency: number,
}

const defaultOptions: Options = {
    frequency: 100,
}

export class SendLoopPlugin implements Plugin {

    private _interval: number | null = null
    private _model!: Model
    private _options: Options

    constructor(options?: Partial<Options>) {
        this._options = { ...defaultOptions, ...options }
    }

    init(model: Model): void {
        this._model = model

        if (this._interval)
            // Init called multiple times
            return

        this._interval = setInterval(this._send, this._options.frequency, undefined)
    }

    private _send = () => {
        this._model.send()
    }

}