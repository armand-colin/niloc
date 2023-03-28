import { Address } from "./Address";

export interface Message {

    originId: string,
    address: Address,
    data: any

}