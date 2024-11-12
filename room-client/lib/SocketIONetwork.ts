import { BinaryReader, BinaryWriter, Message, Network } from "@niloc/core";
import { NetworkMessageHandler } from "@niloc/core/dist/core/Network";
import { Socket } from "socket.io-client";

export class SocketIONetwork implements Network {

    private _messageHandlers: NetworkMessageHandler[] = []
    private _writer = new BinaryWriter()

    constructor(readonly userId: string, readonly io: Socket) {
        io.on('message', this._onMessage)
    }

    send(channel: number, message: Message): void {
        if (message.originId !== this.userId)
            return

        this._writer.clear()
        message.serialize(this._writer)
        this.io.send(channel, this._writer.collect())
    }

    onMessage(callback: NetworkMessageHandler): void {
        this._messageHandlers.push(callback)
    }

    private _onMessage = (channel: number, buffer: ArrayBuffer) => {
        const reader = new BinaryReader(new Uint8Array(buffer))
        const message = Message.deserialize(reader)

        for (const handler of this._messageHandlers)
            handler(channel, message)
    }

}