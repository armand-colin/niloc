export type PresenceMessage = {
    type: "connected";
    userId: string;
} | {
    type: "disconnected";
    userId: string;
};
export declare namespace PresenceMessage {
    function connected(userId: string): PresenceMessage;
    function disconnected(userId: string): PresenceMessage;
}
