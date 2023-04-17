import { Address } from "../core/Address";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC } from "./RPC";
import { Channel } from "../channel/DataChannel";
export interface Application<Data = any> {
    send(address: Address, data: Data): void;
    rpc(): RPC;
    channel<T>(channel: number): Channel<T>;
}
export declare class Application<Data = any> implements Application<Data> {
    readonly id: string;
    readonly network: Network;
    private _rpc;
    private _channels;
    readonly router: Router;
    constructor(id: string, network: Network);
    private _createChannel;
    private _onMessage;
}
