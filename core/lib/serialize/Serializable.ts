import type { BinaryWriter } from "./BinaryWriter"

export type Serializable = {

    serialize(writer: BinaryWriter): void

}