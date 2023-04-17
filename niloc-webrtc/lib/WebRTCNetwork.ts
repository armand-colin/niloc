import { Network, NetworkEvents, Peer } from "niloc-core";
import { Emitter } from "utils"
import { WebRTCOpts } from "./WebRTCOpts";
import { WebRTCPeer } from "./WebRTCPeer";

interface WebRTCNetworkEvents {
    signal: { peerId: string, signal: any },
    connected: string,
    disconnected: string
}

export class WebRTCNetwork implements Network {

    private readonly _id: string
    private readonly _opts: WebRTCOpts
    private readonly _emitter = new Emitter<NetworkEvents>()
    private readonly _webrtcEmitter = new Emitter<WebRTCNetworkEvents>()

    private _peers: Record<string, WebRTCPeer> = { }
    private _connected: Record<string, boolean> = {}

    constructor(id: string, opts: WebRTCOpts) {
        this._id = id
        this._opts = { ...opts }
    }

    id(): string {
        return this._id
    }

    *peers(): Iterable<Peer> {
        for (const id in this._peers)
            yield this._peers[id]
    }

    emitter(): Emitter<NetworkEvents> {
        return this._emitter
    }

    webrtcEmitter(): Emitter<WebRTCNetworkEvents> {
        return this._webrtcEmitter
    }

    signal(peerId: string, signal: any) {
        if (!this._peers[peerId])
            this._createPeer(peerId)
        this._peers[peerId].signal(signal)
    }

    connect(peerId: string) {
        this._createPeer(peerId)
    }

    disconnect(peerId: string) {
        if (this._peers[peerId]) {
            this._peers[peerId].destroy()
            delete this._peers[peerId]
            this._setPeerConnected(peerId, false)
        }
    }

    private _createPeer(peerId: string): WebRTCPeer {
        if (this._peers[peerId]) {
            this._peers[peerId].destroy()
            delete this._peers[peerId]
        }

        const peer = new WebRTCPeer(peerId, this._opts)

        peer.webrtcEmitter().on('signal', signal => this._webrtcEmitter.emit('signal', { peerId, signal }))

        peer.webrtcEmitter().on('destroy', () => {
            if (this._peers[peerId] === peer)
                delete this._peers[peerId]

            this._setPeerConnected(peerId, false)

            if (this._opts.configuration.isHost)
                this.connect(peerId)
        })

        peer.webrtcEmitter().on('connect', () => this._setPeerConnected(peerId, true))

        this._peers[peerId] = peer
        
        return peer
    }

    private _setPeerConnected(peerId: string, connected: boolean) {
        if (this._connected[peerId] !== connected) {
            this._connected[peerId] = connected
            if (connected)
                this._webrtcEmitter.emit('connected', peerId)
            else
                this._webrtcEmitter.emit('disconnected', peerId)
        }
    }

}