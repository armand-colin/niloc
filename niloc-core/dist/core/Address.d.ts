declare enum AddressType {
    Broadcast = 0,
    Target = 1
}
export type Address = {
    type: AddressType.Broadcast;
} | {
    type: AddressType.Target;
    id: string;
};
export declare namespace Address {
    function broadcast(): Address;
    function to(peerId: string): Address;
    function match(destination: Address, target: Address): boolean;
    function toString(address: Address): string;
    function parse(string: string): Address | null;
}
export {};
