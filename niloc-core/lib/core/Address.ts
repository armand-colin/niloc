enum AddressType {
    Broadcast = 0,
    Target = 1,
    Host = 2
}

export type Address =
    { type: AddressType.Broadcast } |
    { type: AddressType.Host } |
    { type: AddressType.Target, id: string }

export namespace Address {

    const BROADCAST = { type: AddressType.Broadcast } as Address
    const HOST = { type: AddressType.Host } as Address

    export function broadcast(): Address {
        return BROADCAST
    }

    export function host(): Address {
        return HOST
    }

    export function to(peerId: string): Address {
        return { type: AddressType.Target, id: peerId }
    }

    export function match(address: Address, peerId: string, peerAddress: Address): boolean {
        if (address.type === AddressType.Broadcast || peerAddress.type === AddressType.Broadcast)
            return true

        if (address.type === AddressType.Host)
            return peerAddress.type === AddressType.Host

        return address.id === peerId
    }

    export function toString(address: Address): string {
        switch (address.type) {
            case AddressType.Broadcast: {
                return "*"
            }
            case AddressType.Target: {
                return `:${address.id}`
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
            return broadcast()

        if (string === "host")
            return host()

        if (string.startsWith(":"))
            return to(string.slice(1))

        return null
    }

}