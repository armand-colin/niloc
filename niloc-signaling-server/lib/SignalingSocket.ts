import { Socket } from "socket.io";

export interface SignalingSocket {
    
    id: string,
    socket: Socket,

}