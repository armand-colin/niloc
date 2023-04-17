import { Address, Application, Model } from "niloc-core"
import { SocketIONetwork } from "niloc-socketio-client"
import { io } from "socket.io-client"
import { Position } from "./Position"
import { Piece, PieceColor } from "./Piece"
import { Board } from "./Board"
import { EventManager } from "./EventManager"
import { PieceMoves } from "./MovesUtils"


export class GameManager {

    public readonly model: Model
    public readonly application: Application

    protected board: Board | null = null

    constructor() {
        const id = Math.random().toString().slice(3, 7)

        const socket = io("http://localhost:3456/", {
            query: { peerId: id }
        })

        const network = new SocketIONetwork(id, socket)
        const application = new Application(id, network)

        const modelChannel = application.channel<any>(1)
        const model = new Model({ channel: modelChannel })

        this.application = application
        this.model = model

        this.model.register(Position.template)
        this.model.register(Piece.template)
        this.model.register(Board.template)

        this.model.emitter().on('created', object => {
            if (object.id() === "board")
                this.board = object as Board
        })

        Object.assign(window, {
            gm: this
        })

        EventManager.emitter.on('pieceClick', this._onPieceClick)
    }

    private _computeCells(): (Piece | null)[][] {
        const cells = Array(8).fill(null).map(_ => Array(8).fill(null))
        if (!this.board)
            return cells

        for (const piece of this.board.pieces.values()) {
            const x = piece.position.get().x.get()
            const y = piece.position.get().y.get()
            cells[x][y] = piece
        }

        return cells
    }

    private _getPieceMoves(piece: Piece): { x: number, y: number }[] {
        const cells = this._computeCells()
        return PieceMoves(piece, cells)
    }

    private _onPieceClick = (data: { piece: Piece }) => {
        const moves = this._getPieceMoves(data.piece)
        EventManager.emitter.emit('selectCells', moves)
    }

}

