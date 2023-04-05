import { Emitter } from "utils";
import { Address } from "../core/Address";
import { Message } from "../core/Message";
import { Network } from "../core/Network";
import { Router } from "../core/Router";
import { RPC } from "./RPC";
interface ApplicationEvents<T> {
    message: Message<T>;
}
export interface Application<T = any> {
    emitter(): Emitter<ApplicationEvents<T>>;
    send(address: Address, data: T): void;
    rpc(): RPC;
}
export declare class Application<T = any> implements Application<T> {
    readonly id: string;
    readonly network: Network;
    private _rpc;
    private _emitter;
    readonly router: Router;
    constructor(id: string, network: Network);
    private _onMessage;
}
export {};
