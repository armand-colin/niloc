import { Identity } from "./Identity"

export enum AddressType {
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

    /**
     * @returns Address that matches all peers (including self)
     */
    export function all(): Address {
        return ALL
    }

    /**
     * @returns Address that matches all peers except the sender
     */
    export function broadcast(): Address {
        return BROADCAST
    }

    /**
     * @returns Address that matches the host of the network
     */
    export function host(): Address {
        return HOST
    }

    /**
     * @returns Address that matches the peer with the given id
     */
    export function to(peerId: string): Address {
        return { type: AddressType.Target, id: peerId }
    }

    /**
     * @returns Address that matches the peer with the computed id
     */
    export function dynamic(getTargetId: () => string): Address {
        return { type: AddressType.Dynamic, get: getTargetId }
    }

    export function fromIdentity(identity: Identity): Address {
        if (identity.host)
            return host()
        return to(identity.userId)
    }

    /**
     * Checks if the given address matches the given identity
     * Used when receiving a message from the network to check if the message should be handled
     */
    export function match(senderId: string, address: Address, identity: Identity): boolean {
        if (address.type === AddressType.All)  
            return true

        if (address.type === AddressType.Broadcast)
            return identity.userId !== senderId

        if (address.type === AddressType.Host)
            return identity.host

        let targetId = address.type === AddressType.Dynamic ? 
            address.get() : 
            address.id

        return targetId === identity.userId
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