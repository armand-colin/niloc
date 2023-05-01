import { Address } from "./Address";
import { Network } from "./Network";
import { Channel } from "../channel/DataChannel";
import { Peer } from "./Peer";
export interface Router {
    id(): string;
    address(): Address;
    self(): Peer;
    channel<T>(channel: number): Channel<T>;
}
export interface RouterOpts {
    network: Network;
    id: string;
    host?: boolean;
}
export declare class Router implements Router {
    private _id;
    private _address;
    private _self;
    private readonly _channels;
    readonly network: Network;
    constructor(opts: RouterOpts);
    private _onMessage;
    private _createChannel;
    private _send;
}
