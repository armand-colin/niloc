import { ModelHandle } from "../ModelHandle";
import { Plugin } from "../Plugin";
type Options = {
    /**
     * Frequency of the loop in milliseconds
     * @default 100
     */
    frequency: number;
    /**
     * Number of ticks to wait before stopping the loop if there
     * is nothing to send
     * @default 3
     */
    tolerance: number;
};
export declare class SendLoopPlugin implements Plugin {
    private _interval;
    private _modelHandle;
    private _options;
    private _uselessTicks;
    constructor(options?: Partial<Options>);
    init(model: ModelHandle): void;
    private _needsSend;
    private _send;
}
export {};
