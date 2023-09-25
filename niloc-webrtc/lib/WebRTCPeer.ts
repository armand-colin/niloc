import { Emitter } from "@niloc/utils"
import { Address, Message, Peer } from "@niloc/core";
import { WebRTCOpts } from "./WebRTCOpts";
import { SimplePeer } from "./SimplePeer"
import type { Instance } from "simple-peer";

interface WebRTCPeerEvents {

    destroy: void
    signal: any
    connect: void

}

interface PeerEvents {
    message: {
        channel: number,
        message: Message
    }
}

function makeAddress(id: string, opts: WebRTCOpts): Address {
    if (opts.configuration.type === "star") {
        if (opts.configuration.host)
            return Address.to(id)
        return Address.broadcast()
    }

    return Address.to(id)
}

export class WebRTCPeer implements Peer {

    private readonly _id: string
    private readonly _address: Address
    private readonly _emitter = new Emitter<PeerEvents>()
    private readonly _webrtcEmitter = new Emitter<WebRTCPeerEvents>()

    private _rtc: Instance

    constructor(id: string, opts: WebRTCOpts) {
        this._id = id
        this._address = makeAddress(id, opts)
        
        this._rtc = new SimplePeer({
            config: {
                iceServers: [
                    { urls: [opts.stun] }
                ]
            },
            initiator: opts.configuration.host,
        })

        this._rtc.on('end', () => this._onError())
        this._rtc.on('error', () => this._onError())
        this._rtc.on('data', data => this._onData(data))
        this._rtc.on('signal', signal => this._webrtcEmitter.emit('signal', signal))
        this._rtc.on('connect', () => this._webrtcEmitter.emit('connect'))
    }

    id(): string {
        return this._id
    }

    address(): Address {
        return this._address
    }

    emitter(): Emitter<PeerEvents> {
        return this._emitter
    }

    webrtcEmitter(): Emitter<WebRTCPeerEvents> {
        return this._webrtcEmitter
    }

    send(channel: number, message: Message): void {
        const data = channel.toString() + JSON.stringify(message)

        if (this._rtc.connected)
            this._rtc.send(data)
        else
            this._rtc.write(data)
    }

    signal(signal: any) {
        this._rtc.signal(signal)
    }

    private _onError() {
        this._webrtcEmitter.emit('destroy')
        this.destroy()
    }

    private _onData(data: string) {
        const channel = Number.parseInt(data[0])
        const message = JSON.parse(data.slice(1))
        this._emitter.emit('message', { channel, message })
    }

    destroy() {
        this._rtc.removeAllListeners()
        this._rtc.destroy()
    }

}