import { Address, Application, Model } from "niloc-core"
import { SocketIONetwork } from "niloc-socketio-client"
import { io } from "socket.io-client"
import { Position } from "./Position"
import { Piece, PieceColor, PieceShape } from "./Piece"
import { Board } from "./Board"
import { EventManager } from "./EventManager"
import { PieceMoves } from "./MovesUtils"


export class GameManager {

    public readonly model: Model
    public readonly application: Application

    protected board: Board | null = null

    private _pieceColor: PieceColor
    private _selectedPiece: Piece | null = null

    constructor(color: PieceColor) {
        this._pieceColor = color

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
        EventManager.emitter.on('cellClick', this._onCellClick)
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
        this._selectedPiece = piece
        return PieceMoves(piece, cells)
    }

    private _isMoveAllowed(piece: Piece, move: { x: number, y: number }) {
        const cells = this._computeCells()
        const moves = PieceMoves(piece, cells)
        return moves.some(({ x, y }) => x === move.x && y === move.y)
    }

    private _onPieceClick = (data: { piece: Piece }) => {
        if (data.piece.color.get() !== this._pieceColor)
            return

        if (this._pieceColor !== this.board?.turn.get())
            return

        const moves = this._getPieceMoves(data.piece)
        EventManager.emitter.emit('selectCells', moves)
    }

    private _onCellClick = (data: { x: number, y: number }) => {
        const selectedPiece = this._selectedPiece
        const board = this.board

        // Not in play mode
        if (!selectedPiece || !board)
            return

        // Not our turn
        if (board.turn.get() !== this._pieceColor)
            return

        // Illegal for this piece
        if (!this._isMoveAllowed(selectedPiece, data))
            return

        if (
            selectedPiece.shape.get() === PieceShape.King || 
            (selectedPiece.shape.get() === PieceShape.Tower && selectedPiece.position.get().x.get() === 7)
        ) {
            this._consumeRock()
        }

        // Kill old piece
        for (const piece of board.pieces.values()) {
            if (piece.position.get().x.get() === data.x && piece.position.get().y.get() === data.y) {
                board.pieces.remove(piece)
                break
            }
        }

        // Move piece
        selectedPiece.position.get().x.set(data.x)
        selectedPiece.position.get().y.set(data.y)

        this._nextTurn()
    }

    isRockAvailable() {
        if (this._pieceColor === PieceColor.White) {
            return !!this.board?.whiteRockAvailable.get()
        } else {
            return !!this.board?.blackRockAvailable.get()
        }   
    }

    isRockPlayable() {
        if (this.board?.turn.get() !== this._pieceColor)
            return false
        if (!this.isRockAvailable())
            return false
        const y = this._pieceColor === PieceColor.White ? 0 : 7
        const cells = this._computeCells()
        if (cells[5][y] !== null || cells[6][y] !== null)
            return false
        return true
    }

    playRock() {
        if (!this.isRockPlayable())
            return
        const cells = this._computeCells()
        const y = this._pieceColor === PieceColor.White ? 0 : 7
        const king = cells[4][y]
        const tower = cells[7][y]

        if (!king ||!tower)
            return
        
        king.position.get().x.set(6)
        tower.position.get().x.set(5)

        this._consumeRock()

        // Change turn
        this._nextTurn()
    }

    private _nextTurn() {
        // Change turn
        this.board?.turn.set(this.board.turn.get() === PieceColor.White ? PieceColor.Black : PieceColor.White)

        this.model.tick()

        this._selectedPiece = null
        EventManager.emitter.emit('selectCells', [])
    }

    private _consumeRock() {
        if (this._pieceColor === PieceColor.White) {
            this.board?.whiteRockAvailable.set(false)
        } else {
            this.board?.blackRockAvailable.set(false)
        } 
    }

}

