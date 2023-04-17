import http from "http"
import { Server } from "socket.io"
import express from "express"
import { SocketIONetwork } from "niloc-socketio-server";
import { Address, Application } from "niloc-core";
import { MachineImplementation } from "./MachineImplementation";
import { Messages, MessageType } from "core";

const PORT = 3456

const app = express()
const server = http.createServer(app);
const io = new Server(server);

const network = new SocketIONetwork()
const application = new Application<Messages>("HOST", network)
const machine = MachineImplementation()

// For now we suppose we only have 1 room
io.on('connection', socket => {
    const peerId = socket.handshake.query.peerId
    if (typeof peerId !== "string") {
        socket.disconnect(true)
        return
    }
    network.addSocket(socket)
    sendMachine(Address.to(peerId))
})

application.emitter().on('message', message => {
    switch (message.data.type) {
        case MessageType.MachineRequest: {
            sendMachine(Address.to(message.originId))
            break
        }
        case MessageType.MachineEvent: {
            const event = message.data.event
            machine.event(event)
            break
        }
    }
})

machine.emitter().on('data', () => sendMachine(Address.broadcast()))
machine.emitter().on('state', () => sendMachine(Address.broadcast()))

function sendMachine(address: Address) {
    const message: Messages = {
        type: MessageType.MachineSync,
        state: machine.state(), 
        data: machine.data()
    }
    application.send(address, message)
}


server.listen(PORT, () => console.info(`Server listening on port ${PORT}`))