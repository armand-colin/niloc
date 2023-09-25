import { Peer } from "./Peer"

enum AddressType {
    All = 0,
    Broadcast = 1,
    Target = 2,
    Host = 3,
    Dynamic = 4
}

export type Address =
    { type: AddressType.All } |
    { type: AddressType.Broadcast } |
    { type: AddressType.Host } |
    { type: AddressType.Target, id: string } | 
    { type: AddressType.Dynamic, get(): string }

export namespace Address {

    const ALL = Object.freeze({ type: AddressType.All }) as Address
    const BROADCAST = Object.freeze({ type: AddressType.Broadcast }) as Address
    const HOST = Object.freeze({ type: AddressType.Host }) as Address

    export function all(): Address {
        return ALL
    }

    export function broadcast(): Address {
        return BROADCAST
    }

    export function host(): Address {
        return HOST
    }

    export function to(peerId: string): Address {
        return { type: AddressType.Target, id: peerId }
    }

    export function dynamic(getTargetId: () => string): Address {
        return { type: AddressType.Dynamic, get: getTargetId }
    }

    export function match(senderId: string, address: Address, peer: Peer): boolean {
        if (
            peer.address().type === AddressType.Broadcast ||
            peer.address().type === AddressType.All ||
            address.type === AddressType.All    
        )  
            return true

        if (address.type === AddressType.Broadcast)
            return peer.id() !== senderId

        if (address.type === AddressType.Host)
            return peer.address().type === AddressType.Host

        let targetId = address.type === AddressType.Dynamic ? 
            address.get() : 
            address.id

        return targetId === peer.id()
    }

    export function toString(address: Address): string {
        switch (address.type) {
            case AddressType.All: {
                return "*"
            }
            case AddressType.Broadcast: {
                return "#"
            }
            case AddressType.Target: {
                return `:${address.id}`
            }
            case AddressType.Dynamic: {
                return `:${address.get()}`
            }
            case AddressType.Host: {
                return `host`
            }
            default: {
                return "?"
            }
        }
    }

    export function parse(string: string): Address | null {
        if (string === "*")
            return all()

        if (string === "#")
            return broadcast()

        if (string === "host")
            return host()

        if (string.startsWith(":"))
            return to(string.slice(1))

        return null
    }

}