import { Message } from "../core/Message"
import { Address } from "../main"
import { Serializable } from "../serialize/Serializable"

export type ChannelMessage<T = any> = {
    originId?: string,
    address?: Address,
    data: Uint8Array | T & Serializable
}

export interface Channel<T> {

    post(message: ChannelMessage<T>): void
    addListener(callback: (message: Message<T>) => void): void
    removeListener(callback: (message: Message<T>) => void): void

}