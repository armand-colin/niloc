import { Network } from "./Network";
import { Channel } from "../channel/DataChannel";
export interface Router {
    id(): string;
    channel<T>(channel: number): Channel<T>;
}
export declare class Router implements Router {
    readonly network: Network;
    private readonly _id;
    private readonly _address;
    private readonly _channels;
    constructor(id: string, network: Network);
    private _onMessage;
    private _createChannel;
    private _send;
}
