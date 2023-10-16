import { ModelHandle } from "../ModelHandle";
import { Plugin } from "../Plugin";

type Options = {
    /**
     * Frequency of the loop in milliseconds
     * @default 100
     */
    frequency: number,
    /**
     * Number of ticks to wait before stopping the loop if there
     * is nothing to send
     * @default 3
     */
    tolerance: number
} 

const defaultOptions: Options = {
    frequency: 100,
    tolerance: 3
}

export class SendLoopPlugin implements Plugin {

    private _interval: number | null = null
    private _modelHandle!: ModelHandle
    private _options: Options

    private _uselessTicks = 0

    constructor(options?: Partial<Options>) {
        this._options = { ...defaultOptions, ...options }
    }

    init(model: ModelHandle): void {
        this._modelHandle = model

        model.changeQueue().emitter().on('needsSend', this._needsSend)

        if (model.changeQueue().needsSend())
            this._needsSend()
    }

    private _needsSend = () => {
        if (this._interval !== null)
            return

        this._interval = setInterval(this._send, this._options.frequency, undefined)
    }

    private _send = () => {
        if (!this._modelHandle.changeQueue().needsSend()) {
            this._uselessTicks++

            if (this._uselessTicks >= this._options.tolerance) {
                clearInterval(this._interval!)
                this._interval = null
                this._uselessTicks = 0
            }

            return
        }

        this._modelHandle.send()
    }

}