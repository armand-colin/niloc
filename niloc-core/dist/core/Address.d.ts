import { Peer } from "./Peer";
declare enum AddressType {
    All = 0,
    Broadcast = 1,
    Target = 2,
    Host = 3,
    Dynamic = 4
}
export type Address = {
    type: AddressType.All;
} | {
    type: AddressType.Broadcast;
} | {
    type: AddressType.Host;
} | {
    type: AddressType.Target;
    id: string;
} | {
    type: AddressType.Dynamic;
    get(): string;
};
export declare namespace Address {
    /**
     * @returns Address that matches all peers (including self)
     */
    function all(): Address;
    /**
     * @returns Address that matches all peers except the sender
     */
    function broadcast(): Address;
    /**
     * @returns Address that matches the host of the network
     */
    function host(): Address;
    /**
     * @returns Address that matches the peer with the given id
     */
    function to(peerId: string): Address;
    /**
     * @returns Address that matches the peer with the computed id
     */
    function dynamic(getTargetId: () => string): Address;
    /**
     * Checks if the given address matches the given peer
     * Used when receiving a message from the network to check if the message should be handled
     */
    function match(senderId: string, address: Address, peer: Peer): boolean;
    function toString(address: Address): string;
    function parse(string: string): Address | null;
}
export {};
