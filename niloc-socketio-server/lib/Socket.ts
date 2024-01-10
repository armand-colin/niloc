export type Socket = {

    send(channel: any, data: any): void
    on(event: 'message', callback: (channel: any, message: any) => void): void
    on(event: 'disconnect', callback: () => void): void
    removeAllListeners(): void
    
}