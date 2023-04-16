import { Emitter } from "utils";
import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC } from "./RPC";
import { Channel } from "../channel/DataChannel";
interface ApplicationEvents<T> {
    message: Message<T>;
}
export interface Application<Data = any> {
    emitter(): Emitter<ApplicationEvents<Data>>;
    send(address: Address, data: Data): void;
    rpc(): RPC;
    channel<T>(channel: number): Channel<T>;
}
export declare class Application<Data = any> implements Application<Data> {
    readonly id: string;
    readonly network: Network;
    private _rpc;
    private _emitter;
    private _channels;
    readonly router: Router;
    constructor(id: string, network: Network);
    private _createChannel;
    private _onMessage;
}
export {};
