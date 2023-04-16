import { Address, Application, Model } from "niloc-core"
import { SocketIONetwork } from "niloc-socketio-client"
import { io } from "socket.io-client"
import { Position } from "./Position"
import { Piece } from "./Piece"
import { Board } from "./Board"


export class GameManager {

    public readonly model: Model
    public readonly application: Application


    public static instance: GameManager

    constructor() {
        const id = Math.random().toString().slice(3, 7)

        const socket = io("http://localhost:3456/", {
            query: {
                peerId: id
            }
        })

        const network = new SocketIONetwork(id, socket)
        const application = new Application(id, network)

        const channel = application.channel<any>(0)
        const model = new Model({ channel })

        this.application = application
        this.model = model

        this.model.register(Position.template)
        this.model.register(Piece.template)
        this.model.register(Board.template)

        const testChannel = this.application.channel(1)
        setInterval(() => {
            console.log("sending");
            testChannel.post(Address.broadcast(), "ping")
        }, 1000)
        testChannel.addListener(message => {
            console.log(message.originId, message.data);
        })

        Object.assign(window, {
            gm: this
        })
    }

}