import http from "http"
import { Server, Socket } from "socket.io"
import express from "express"
import { SocketIONetwork } from "@niloc/socketio-server";
import { Address, Channel, PresenceMessage, Router } from "@niloc/core"

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

    private _presence: Channel<PresenceMessage> | null = null

    private _sockets: { socket: Socket, peerId: string }[] = []

    constructor(public readonly id: string, presence?: number) {
        this._network = new SocketIONetwork()
        this._router = new Router({ id: "SERVER", network: this._network })

        if (presence !== undefined) {
            const channel = this._router.channel(presence)
            const [_, presenceChannel] = Channel.split(channel, 2)
            this._presence = presenceChannel
        }
    }

    add(socket: Socket, id: string, host: boolean) {
        this._network.addSocket(socket, id, host)
        this._sockets.push({ socket, peerId: id })

        if (this._presence) {
            this._presence.post(Address.broadcast(), PresenceMessage.connected(id))

            for (const { peerId } of this._sockets) {
                if (peerId === id)
                    continue
                this._presence.post(Address.to(id), PresenceMessage.connected(peerId))
            }
        }
    }

    remove(socket: Socket) {
        const index = this._sockets.findIndex(({ socket: s }) => socket === s)
        if (index === -1)
            return

        const [{ peerId }] = this._sockets.splice(index, 1)

        if (!this.empty && this._presence)
            this._presence.post(Address.broadcast(), PresenceMessage.disconnected(peerId))
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

    const presence = typeof socket.handshake.query.presence === "string" ?
        parseInt(socket.handshake.query.presence) :
        -1

    if (
        typeof peerId !== "string" ||
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