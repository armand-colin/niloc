import type { BinaryReader } from "./BinaryReader"

export type Deserializer<T> = {

    deserialize(reader: BinaryReader): T

}