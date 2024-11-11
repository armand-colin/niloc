import { BinaryReader, BinaryWriter } from "../main";
import { Deserializer } from "../serialize/Deserializer";
import { Serializable } from "../serialize/Serializable";
import { staticImplements } from "./staticImplements";

@staticImplements<Deserializer<Json>>()
export class Json<T = any> implements Serializable {

    constructor(readonly data: T) { }

    static from<T>(data: T): Json<T> {
        return new Json(data)
    }

    serialize(writer: BinaryWriter): void {
        writer.writeString(JSON.stringify(this.data))
    }

    static deserialize(reader: BinaryReader): Json {
        const string = reader.readString()
        const data = JSON.parse(string)
        return new Json(data)
    }

}