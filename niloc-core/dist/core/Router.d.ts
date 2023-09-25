import { Address } from "./Address";
import { Network } from "./Network";
import { Channel } from "../channel/Channel";
import { Peer } from "./Peer";
import { Context } from "./Context";
export interface RouterOpts {
    /**
     * peerId of this router
     */
    id: string;
    network: Network;
    /**
     * Whether this router should relay messages upon reception or not
     * @default false
     */
    relay?: boolean;
    /**
     * Whether this router is a host or not
     * @default false
     */
    host?: boolean;
}
export declare class Router {
    private _id;
    private _relay;
    private _address;
    private _self;
    private _context;
    private readonly _channels;
    readonly network: Network;
    constructor(opts: RouterOpts);
    /**
     * @returns peerId of the router
     */
    id(): string;
    /**
     * @returns address of the router
     */
    address(): Address;
    /**
     * Gives a peer representing this router. This could be useful to test is an address matches a router for example.
     *
     * @example
     * ```ts
     * Address.match(address, router.self())
     * ```
     */
    self(): Peer;
    /**
     * Get a channel by index, creating it if needed. This will then be usefull to send / retrieve data from the network
     * @param channel index of the desired channel
     * @example
     * ```ts
     * // Getting channel 0
     * const channel = router.channel<string>(0)
     * channel.post(Address.to("friend"), "Hello world")
     * ```
     */
    channel<T = any>(channel: number): Channel<T>;
    context(): Context;
    private _onMessage;
    private _receive;
    private _createChannel;
    private _send;
}
