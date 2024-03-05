import http from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { SocketIONetwork } from "@niloc/socketio-server";
import { FrameworkChannels, ConnectionList, Identity, Router } from "@niloc/core"

const PORT = process.argv[2] ?? 3000

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

    private readonly _network: SocketIONetwork
    private readonly _router: Router
    private readonly _connectionList: ConnectionList

    private _sockets: { socket: Socket, peerId: string }[] = []

    constructor() {
        const identity = new Identity("SERVER")

        this._network = new SocketIONetwork()

        this._router = new Router({
            network: this._network,
            identity,
        })

        const channel = this._router.channel(FrameworkChannels.ConnectionList)
        const connectionList = ConnectionList.owner(channel)
        this._connectionList = connectionList
    }

    add(socket: Socket, id: string, host: boolean) {
        this._network.addSocket(socket, id, host)
        this._sockets.push({ socket, peerId: id })
        this._connectionList.connected(new Identity(id, host))
    }

    remove(socket: Socket) {
        const index = this._sockets.findIndex(({ socket: s }) => socket === s)
        if (index === -1)
            return

        const [{ peerId }] = this._sockets.splice(index, 1)

        this._connectionList.disconnected(peerId)
    }

    get empty() {
        return this._sockets.length === 0
    }

}

const room = new Room()

io.on('connection', socket => {
    const peerId = socket.handshake.query.peerId as string
    const host = socket.handshake.query.host === "true"

    room.add(socket, peerId, host)

    socket.on('disconnect', () => room.remove(socket))
})

server.listen(PORT, () => {
    console.info(`Listening on http://localhost:${PORT}`)
})