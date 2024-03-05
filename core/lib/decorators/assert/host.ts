import { HostAssert } from "../../assert/customs/HostAssert";
import { custom } from "./custom";

export function host() {

    return custom(() => new HostAssert())

}