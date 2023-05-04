import { Address } from "./Address";
import { Network } from "./Network";
import { Channel } from "../channel/DataChannel";
import { Peer } from "./Peer";
export interface RouterOpts {
    id: string;
    /**
     * peerId of this router
     */
    network: Network;
    /**
     * Whether this router is a host or not
     * @default false
     */
    host?: boolean;
}
export declare class Router {
    private _id;
    private _address;
    private _self;
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
    private _onMessage;
    private _createChannel;
    private _send;
}
