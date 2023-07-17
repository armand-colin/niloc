import { nanoid } from "nanoid";
import { Presence } from "../core/Presence";
import { io } from "socket.io-client";
import { Channels } from "../core/Channels";
import { SocketIONetwork } from "@niloc/socketio-client";
import { Model, Router } from "@niloc/core";
import { Line } from "./shapes/Line";

const params = new URLSearchParams(window.location.search)
const roomId = params.get("roomId")
if (!roomId) {
    window.location.href = "/?roomId=" + nanoid(7)
    throw "Redirecting..."
}

export namespace State {
    const peerId = nanoid(7)

    const socket = io("http://localhost:3456", {
        query: {
            roomId,
            peerId,
            presence: Channels.ConnectionList
        }
    })

    const network = new SocketIONetwork(socket)

    export const router = new Router({ id: peerId, network })
    
    export const presence = new Presence(router)

    export const model = new Model({
        channel: router.channel(Channels.Model),
        context: router.context(),
    })

    model.register(Line.template)
}