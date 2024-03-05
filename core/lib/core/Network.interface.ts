import { IEmitter } from "@niloc/utils"
import { Message } from "./Message"

export interface NetworkEvents {
    connected: void,
    disconnected: void,
    message: {
        peerId: string,
        channel: number, 
        message: Message
    }
}

export interface INetwork extends IEmitter<NetworkEvents> {

    connected: boolean

    send(channel: number, message: Message, senderId: string): void

}
