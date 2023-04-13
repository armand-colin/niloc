import { Address, Message } from "../main";
import { MPSC } from "./MPSC";

export interface Channel<T> {
    
    post(address: Address, message: T): void
    addListener(callback: (message: Message<T>) => void): void
    removeListener(callback: (message: Message<T>) => void): void

}

export interface OutputChannel<T> {
    
    post(message: Message<T>): void
    setListener(callback: (address: Address, message: T) => void): void

}

export interface DataChannel<T> {

    channel(): number
    input(): Channel<T>
    output(): OutputChannel<T>

}

/**
 * Input: posts [address, data]
 * Output: posts [Message<data>]
 */


export class DataChannel<T> implements DataChannel<T> {

    private _channel: number
    private _mpsc = new MPSC<[Address, T], [Message<T>]>()
    private _input: Channel<T>
    private _output: OutputChannel<T>

    constructor(channel: number) {
        this._channel = channel

        this._input = {
            post: (address, message) => this._mpsc.postInput(address, message),
            addListener: (callback) => this._mpsc.addOutputListener(callback),
            removeListener: (callback) => this._mpsc.removeOutputListener(callback)
        }

        this._output = {
            post: (message) => this._mpsc.postOutput(message),
            setListener: (callback) => this._mpsc.setInputListener(callback)
        }
    }

    channel(): number { return this._channel }
    input(): Channel<T> { return this._input }
    output(): OutputChannel<T> { return this._output }

}