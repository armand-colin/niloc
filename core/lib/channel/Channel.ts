import { Message } from "../core/Message"

export interface Channel<T> {

    post(message: Message<T>): void
    addListener(callback: (message: Message<T>) => void): void
    removeListener(callback: (message: Message<T>) => void): void

}

export namespace Channel {

    // TODO: see in the future

    // export function split<N extends number>(channel: Channel<any>, n: number): Channel<any>[] & { length: N } {
    //     const channels: Channel<any>[] = []

    //     const emitter = new Emitter<{ [i: string]: Message<any> }>()

    //     channel.addListener((message) => {
    //         const [i, data] = message.data
    //         emitter.emit(i.toString(), { ...message, data })
    //     })

    //     for (let i = 0; i < n; i++) {
    //         channels.push({
    //             post: (address, message) => {
    //                 channel.post(address, [i, message])
    //             },
    //             addListener: (callback) => {
    //                 emitter.on(i.toString(), callback)
    //             },
    //             removeListener: (callback) => {
    //                 emitter.off(i.toString(), callback)
    //             }
    //         })
    //     }

    //     return channels as any
    // }

}