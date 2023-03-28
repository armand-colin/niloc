import { test } from "@jest/globals";
import { Address } from "../core/Address";

test("Address.make", () => {
    Address.to("host")
    Address.broadcast()
    Address.to("client")
})