import { BinaryReader, BinaryWriter } from "../main";
import { Deserializer } from "../serialize/Deserializer";
import { Serializable } from "../serialize/Serializable";
import { staticImplements } from "../tools/staticImplements";
import { Address } from "./Address";

const EMPTY_BUFFER = new Uint8Array(0)

type MessageOpts<T> = {
    originId: string,
    address: Address,
    data: Uint8Array | T & Serializable,
}

@staticImplements<Deserializer<Message>>()
export class Message<T = any> implements Serializable {

    originId: string
    address: Address
    buffer: Uint8Array

    constructor(opts: MessageOpts<T>) {
        this.originId = opts.originId
        this.address = opts?.address ?? Address.broadcast()

        this.buffer = EMPTY_BUFFER
        
        if (opts.data instanceof Uint8Array) {
            this.buffer = opts.data
        } else {
            this._serialize(opts.data)
        }
    }

    static deserialize(reader: BinaryReader): Message {
        const originId = reader.readString()
        const address = Address.read(reader)
        const bufferLength = reader.readU()
        const buffer = reader.read(bufferLength)

        return new Message({
            originId,
            address,
            data: buffer,
        })
    } 

    serialize(writer: BinaryWriter): void {
        writer.writeString(this.originId)
        Address.write(this.address, writer)
        writer.writeU(this.buffer.length)
        writer.write(this.buffer)
    }

    private _serialize(serializable: Serializable) {
        const writer = new BinaryWriter()
        serializable.serialize(writer)
        this.buffer = writer.collect()
    }

    deserialize(deserializer: Deserializer<T>): T {
        const reader = new BinaryReader(this.buffer)
        return deserializer.deserialize(reader)
    }

}
