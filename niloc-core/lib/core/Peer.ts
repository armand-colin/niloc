import { Address } from "./Address"
import { Message } from "./Message"

export interface Peer {

    /**
     * Id of the peer
     */
    id(): string
    
    /**
     * Network address
     */
    address(): Address
    
    /**
     * Send a message to this peer with the given channel
     * @param channel Channel index
     * @param message Message to send, filled in with the correct address and originId
     */
    send(channel: number, message: Message): void

}