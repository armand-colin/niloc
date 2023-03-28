enum AddressType {
    Broadcast = 0,
    Target = 1
}

export type Address =
    { type: AddressType.Broadcast } |
    { type: AddressType.Target, id: string }

export namespace Address {

    const BROADCAST = { type: AddressType.Broadcast } as Address

    export function broadcast(): Address {
        return BROADCAST
    }

    export function to(peerId: string): Address {
        return { type: AddressType.Target, id: peerId }
    }

    export function match(destination: Address, target: Address): boolean {
        if (destination.type === AddressType.Broadcast || target.type === AddressType.Broadcast)
            return true
        return destination.id === target.id
    }

    export function toString(address: Address): string {
        switch (address.type) {
            case AddressType.Broadcast:
                return "*"
            case AddressType.Target:
                return `:${address.id}`
            default:
                return "?"
        }
    }

    export function parse(string: string): Address | null {
        if (string === "*")
            return broadcast()
            
        if (string.startsWith(":"))
            return to(string.slice(1))

        return null
    }

}