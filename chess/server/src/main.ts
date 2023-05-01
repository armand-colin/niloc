import http from "http"
import { Server } from "socket.io"
import express from "express"
import { SocketIONetwork } from "niloc-socketio-server";
import { Address, Router } from "niloc-core"

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
const router = new Router({ id: "SERVER", network })

const channel = router.channel(0)

// For now we suppose we only have 1 room
io.on('connection', socket => {
    const peerId = socket.handshake.query.peerId
    const host = socket.handshake.query.host === "true"
 
    if (typeof peerId !== "string") {
        socket.disconnect(true)
        return
    }

    network.addSocket(socket, peerId, host)
    channel.post(Address.broadcast(), { type: "connected", peerId, host })
})

server.listen(PORT, () => {
    console.info(`Listening on http://localhost:${PORT}`);
})