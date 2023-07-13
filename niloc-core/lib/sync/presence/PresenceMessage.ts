export type PresenceMessage = {
    type: "connected",
    userId: string
} | {
    type: "disconnected",
    userId: string
}

export namespace PresenceMessage {

    export function connected(userId: string): PresenceMessage {
        return { type: "connected", userId }
    }

    export function disconnected(userId: string): PresenceMessage {
        return { type: "disconnected", userId }
    }

}