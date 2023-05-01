import { Network } from "./Network";
import { Channel } from "../channel/DataChannel";
export interface Router {
    channel<T>(channel: number): Channel<T>;
}
export declare class Router implements Router {
    readonly network: Network;
    private readonly _channels;
    constructor(network: Network);
    private _onMessage;
    private _createChannel;
    private _send;
}
