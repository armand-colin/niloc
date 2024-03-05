import { BinaryReader, BinaryWriter } from "../main"
import { Deserializer } from "../serialize/Deserializer"
import { staticImplements } from "../tools/staticImplements"

export type SerializedIdentity = {
    userId: string
    host: boolean
}

@staticImplements<Deserializer<Identity>>()
export class Identity {

    readonly host: boolean
    readonly userId: string

    static deserialize(reader: BinaryReader): Identity {
        const host = reader.readBoolean()
        const userId = reader.readString()

        return new Identity(userId, host)
    }

    constructor(userId: string, host: boolean = false) {
        this.host = host
        this.userId = userId
    }

    serialize(writer: BinaryWriter) {
        writer.writeBoolean(this.host)
        writer.writeString(this.userId)
    }

}
