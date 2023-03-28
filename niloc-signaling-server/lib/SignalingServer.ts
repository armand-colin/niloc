import { Server as HTTPServer } from 'http'
import { Server, ServerOptions } from 'socket.io'
import { SignalingRoom } from './SignalingRoom'
import { SignalingSocket } from './SignalingSocket'

interface SignalingServerOpts {
    cors: ServerOptions["cors"]
}

export class SignalingServer {

    private _server: Server
    private _rooms: Record<string, SignalingRoom> = {}

    constructor(httpServer: HTTPServer, opts: Partial<SignalingServerOpts> = {}) {
        this._server = new Server(httpServer, { cors: opts.cors })
        this._server.on('connection', socket => {
            const { id, room: roomId } = socket.handshake.query
            if (!id || !roomId || !(typeof id === "string") || !(typeof roomId === "string")) {
                socket.disconnect(true)
                return
            }

            const room = this._getRoom(roomId)
            const signalingSocket = { socket, id }

            socket.on('disconnect', () => this._onSocketDisconnect(signalingSocket, room))
            this._onSocketConnect(signalingSocket, room)
        });
    }

    private _getRoom(roomId: string): SignalingRoom {
        const room = this._rooms[roomId] ?? new SignalingRoom(roomId)
        this._rooms[roomId] = room
        return room
    }

    private _onSocketConnect(socket: SignalingSocket, room: SignalingRoom) {
        room.join(socket)

        socket.socket.on('signal', ({ peerId, signal }) => {
            room.signal(socket.id, peerId, signal)
        })
    }

    private _onSocketDisconnect(socket: SignalingSocket, room: SignalingRoom) {
        room.leave(socket)
        if (room.size() === 0)
            delete this._rooms[room.id]
    }

}