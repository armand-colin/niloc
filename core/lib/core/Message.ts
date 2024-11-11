import { BinaryReader, BinaryWriter } from "../main";
import { Deserializer } from "../serialize/Deserializer";
import { Serializable } from "../serialize/Serializable";
import { Address } from "./Address";

const EMPTY_BUFFER = new Uint8Array(0)

type MessageOpts<T> = {
    originId: string,
    address: Address,
    data: Uint8Array | T & Serializable,
}
export class Message<T = any> {

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
            this.serialize(opts.data)
        }
    }

    setBuffer(buffer: Uint8Array) {
        this.buffer = buffer
    }
    
    serialize(serializable: Serializable) {
        const writer = new BinaryWriter()
        serializable.serialize(writer)
        this.buffer = writer.collect()
    }

    deserialize(deserializer: Deserializer<T>): T {
        const reader = new BinaryReader(this.buffer)
        return deserializer.deserialize(reader)
    }

}
