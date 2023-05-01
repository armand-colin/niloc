import { Peer } from "./Peer";
declare enum AddressType {
    Broadcast = 0,
    Target = 1,
    Host = 2
}
export type Address = {
    type: AddressType.Broadcast;
} | {
    type: AddressType.Host;
} | {
    type: AddressType.Target;
    id: string;
};
export declare namespace Address {
    function broadcast(): Address;
    function host(): Address;
    function to(peerId: string): Address;
    function match(address: Address, peer: Peer): boolean;
    function toString(address: Address): string;
    function parse(string: string): Address | null;
}
export {};
