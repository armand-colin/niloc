import { BinaryReader, BinaryWriter } from "../main";
import { Deserializer } from "../serialize/Deserializer";
import { Serializable } from "../serialize/Serializable";
import { Address } from "./Address";

const EMPTY_BUFFER = new Uint8Array(0)

export class Message<T = any> {

    originId: string
    address: Address
    buffer: Uint8Array

    constructor(opts: {
        originId: string,
        address?: Address,
    }) {
        this.originId = opts.originId
        this.address = opts?.address ?? Address.broadcast()
        this.buffer = EMPTY_BUFFER
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
