import { Address } from "./Address";

export interface Message<T = any> {

    originId: string,
    address: Address,
    data: T

}