import http from "http"
import { Server } from "socket.io"
import express from "express"
import { SocketIONetwork } from "niloc-socketio-server";
import { Address, Application } from "niloc-core"

const PORT = 3456

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: "*",
        allowedHeaders: "*"
    }
});

const network = new SocketIONetwork()
const application = new Application("SERVER", network)

// For now we suppose we only have 1 room
io.on('connection', socket => {
    const peerId = socket.handshake.query.peerId
    if (typeof peerId !== "string") {
        socket.disconnect(true)
        return
    }
    network.addSocket(socket)
    application.send(Address.broadcast(), { connected: peerId })
})

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})