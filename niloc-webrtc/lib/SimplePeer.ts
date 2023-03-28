import { Instance, Options } from "simple-peer"
import * as Constructor from "simple-peer"

export const SimplePeer = (Constructor?.default ?? Constructor) as unknown as { new(opts: Options): Instance }