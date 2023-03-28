import { Emitter } from "utils"
import { io, Socket } from "socket.io-client"

export interface SignalingClientEvents {
    signal: { peerId: string, signal: any },
    connected: void,
    disconnected: void,
    error: any
}

interface SignalingClientOpts {
    path: string,
    room: string
}

export class SignalingClient {

    private _id: string
    private _socket: Socket
    private _opts: SignalingClientOpts
    private _emitter = new Emitter<SignalingClientEvents>()

    constructor(id: string, opts: SignalingClientOpts) {
        this._id = id
        this._opts = opts
        this._socket = this._createIO()
    }

    emitter(): Emitter<SignalingClientEvents> {
        return this._emitter
    }

    signal(peerId: string, signal: any) {
        this._socket.send('signal', { peerId, signal })
    }

    private _createIO(): Socket {
        const socket = io(this._opts.path, {
            query: { id: this._id, room: this._opts.room },
        })

        console.log('create');
        
        socket.on('connect', () => {
            console.log('connect sig')
            this._emitter.emit('connected')
        })
        socket.on('disconnect', () => {
            console.log('disc')
            this._emitter.emit('disconnected')
        })
        socket.on('error', e => {
            console.log('err', e)
            this._emitter.emit('error', e)
        })

        return socket
    }

}