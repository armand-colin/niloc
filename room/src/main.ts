import http from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { SocketIONetwork } from "@niloc/socketio-server";
import { Router } from "@niloc/core"

const PORT = process.argv[2] ?? 3000

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: "*",
        allowedHeaders: "*"
    }
});

class Room {

    private readonly _network: SocketIONetwork
    private readonly _router: Router

    private _sockets: Socket[] = []

    constructor(public readonly id: string) {
        this._network = new SocketIONetwork()
        this._router = new Router({ id: "SERVER", network: this._network })
    }

    add(peer: Socket, id: string, host: boolean) {
        this._network.addSocket(peer, id, host)
        this._sockets.push(peer)
    }

    remove(peer: Socket) {
        const index = this._sockets.findIndex(s => peer === s)
        if (index !== -1)
            this._sockets.splice(index, 1)
    }

    get empty() {
        return this._sockets.length === 0
    }

}

const rooms = new Map<string, Room>()

// For now we suppose we only have 1 room
io.on('connection', socket => {
    const peerId = socket.handshake.query.peerId
    const host = socket.handshake.query.host === "true"
    const roomId = socket.handshake.query.roomId
 
    if (
        typeof peerId !== "string" ||
        typeof roomId !== "string"
    ) {
        socket.disconnect(true)
        return
    }

    let room = rooms.get(roomId) ?? (() => {
        const room = new Room(roomId)
        rooms.set(roomId, room)
        return room
    })()

    room.add(socket, peerId, host)

    socket.on('disconnect', () => {
        room.remove(socket)
        if (room.empty)
            rooms.delete(roomId)
        socket.removeAllListeners()
    })
})

server.listen(PORT, () => {
    console.info(`Listening on http://localhost:${PORT}`);
})