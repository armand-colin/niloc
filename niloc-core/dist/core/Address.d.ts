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
    function all(): Address;
    function broadcast(): Address;
    function host(): Address;
    function to(peerId: string): Address;
    function dynamic(getTargetId: () => string): Address;
    function match(senderId: string, address: Address, peer: Peer): boolean;
    function toString(address: Address): string;
    function parse(string: string): Address | null;
}
export {};
