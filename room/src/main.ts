import http from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { ConnectionList, Identity, Router } from "@niloc/core"
import { SocketIONetwork } from "./SocketIONetwork"

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: "*",
        allowedHeaders: "*"
    }
})

class Room {

    private readonly _router: Router

    private _connectionList?: ConnectionList
    private _network: SocketIONetwork

    private _sockets: { socket: Socket, peerId: string }[] = []

    constructor(public readonly id: string, presence?: number) {
        const identity = new Identity("SERVER")

        this._network = new SocketIONetwork()

        this._router = new Router({ 
            network: this._network,
            identity,
        })

        if (presence !== undefined) {
            const channel = this._router.channel(presence)
            const connectionList = ConnectionList.owner(channel)
            this._connectionList = connectionList
        }
    }

    add(socket: Socket, id: string, isHost: boolean) {
        this._network.addSocket(socket, id, isHost)
        this._sockets.push({ socket, peerId: id })

        if (this._connectionList)
            this._connectionList.connected(new Identity(id, isHost))
    }

    remove(socket: Socket) {
        const userId = this._network.removeSocket(socket)
        if (userId && this._connectionList)
            this._connectionList.disconnected(userId)
    }

    get empty() {
        return this._sockets.length === 0
    }

}

const rooms = new Map<string, Room>()

io.on('connection', socket => {
    const userId = socket.handshake.query.userId
    const isHost = socket.handshake.query.isHost === "true"
    const roomId = socket.handshake.query.roomId

    const presence = typeof socket.handshake.query.presence === "string" ?
        parseInt(socket.handshake.query.presence) :
        -1

    if (
        typeof userId !== "string" ||
        typeof roomId !== "string"
    ) {
        socket.disconnect(true)
        return
    }

    let room = rooms.get(roomId) ?? (() => {
        const room = new Room(roomId, presence)
        rooms.set(roomId, room)
        return room
    })()

    room.add(socket, userId, isHost)

    socket.on('disconnect', () => {
        room.remove(socket)

        if (room.empty)
            rooms.delete(roomId)

        socket.removeAllListeners()
    })
})

server.listen(PORT, () => {
    console.info(`Listening on http://localhost:${PORT}`)
})