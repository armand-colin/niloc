import { Message } from "./Message"

export type NetworkMessageHandler = (channel: number, message: Message) => void

export interface Network {

    send(channel: number, message: Message): void
    onMessage(callback: NetworkMessageHandler): void

}