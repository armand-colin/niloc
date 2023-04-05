import { Emitter } from "utils";
import { Address } from "./Address";
import { Message } from "./Message";
import { Network } from "./Network";
interface RouterEvents {
    message: {
        message: Message;
        channel: number;
    };
}
export interface Router {
    id(): string;
    send(address: Address, channel: number, data: any): void;
    emitter(): Emitter<RouterEvents>;
}
export declare class Router implements Router {
    readonly network: Network;
    private readonly _address;
    private readonly _emitter;
    private readonly _id;
    constructor(id: string, network: Network);
    private _onMessage;
}
export {};
