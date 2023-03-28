import { SignalingSocket } from "./SignalingSocket"

export class SignalingRoom {

    _sockets: Record<string, Set<SignalingSocket>> = {}

    constructor(public readonly id: string) { }

    size() {
        return Object.keys(this._sockets).length
    }

    join(socket: SignalingSocket) {
        socket.socket.join(this.id)
        if (!this._sockets[socket.id])
            this._sockets[socket.id] = new Set()
        this._sockets[socket.id].add(socket)
    }

    leave(socket: SignalingSocket) {
        socket.socket.leave(this.id)
        if (!this._sockets[socket.id])
            return
        this._sockets[socket.id].delete(socket)
        if (this._sockets[socket.id].size === 0)
            delete this._sockets[socket.id]
    }

    signal(originId: string, peerId: string, signal: any) {
        if (!this._sockets[peerId])
            return
        for (const socket of this._sockets[peerId])
            socket.socket.emit('signal', { peerId: originId, signal })
    }

}