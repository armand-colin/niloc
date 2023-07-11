import { Address, Message } from "../main";
import { Channel } from "./Channel";
export interface OutputChannel<T> {
    post(message: Message<T>): void;
    setListener(callback: (address: Address, message: T) => void): void;
}
export interface DataChannel<T> {
    channel(): number;
    input(): Channel<T>;
    output(): OutputChannel<T>;
}
/**
 * Input: posts [address, data]
 * Output: posts [Message<data>]
 */
export declare class DataChannel<T> implements DataChannel<T> {
    private _channel;
    private _mpsc;
    private _input;
    private _output;
    constructor(channel: number);
}
