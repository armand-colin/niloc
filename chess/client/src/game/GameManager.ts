import { Address, Model, Router, RPC, RPCHandler } from "niloc-core"
import { SocketIONetwork } from "niloc-socketio-client"
import { io } from "socket.io-client"
import { Position } from "./Position"
import { Piece, PieceColor, PieceShape } from "./Piece"
import { Board } from "./Board"
import { EventManager } from "./EventManager"
import { PieceMoves } from "./MovesUtils"


export class GameManager {

    public readonly model: Model
    public readonly router: Router

    public readonly board: Board

    public readonly pieceColor: PieceColor
    
    private _selectedPiece: Piece | null = null

    constructor(url: string, color: PieceColor, host = false) {
        console.log('build', url);

        this.pieceColor = color

        const id = Math.random().toString().slice(3, 7)

        const socket = io(url, {
            query: {
                peerId: id,
                host
            }
        })

        const network = new SocketIONetwork(socket)
        const router = new Router({ id, network, host })

        const modelChannel = router.channel<any>(1)
        const model = new Model({ channel: modelChannel })

        const rpcChannel = router.channel<any>(2)
        const rpcHandler = new RPCHandler(router.self(), rpcChannel)

        rpcHandler.register(this.playMoveRPC, "playMove")
        rpcHandler.register(this.playRockRPC, "playRock")

        this.router = router
        this.model = model

        this.model.register(Position.template)
        this.model.register(Piece.template)
        this.model.register(Board.template)

        this.board = this.model.instantiate(Board.template, "board")

        Object.assign(window, { gm: this })

        EventManager.emitter.on('pieceClick', this._onPieceClick)
        EventManager.emitter.on('cellClick', this._onCellClick)

    }

    private _computeCells(): (Piece | null)[][] {
        const cells = Array(8).fill(null).map(_ => Array(8).fill(null))

        for (const piece of this.board.pieces.values()) {
            const x = piece.position.get().x
            const y = piece.position.get().y
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
        console.log('on piece click', data.piece.color.get(), this.pieceColor);

        if (data.piece.color.get() !== this.pieceColor)
            return

        if (this.pieceColor !== this.board.turn.get())
            return

        const moves = this._getPieceMoves(data.piece)
        EventManager.emitter.emit('selectCells', moves)
    }

    private _onCellClick = (data: { x: number, y: number }) => {
        // Not in play mode
        if (!this._selectedPiece)
            return

        console.log('play move');

        this.playMoveRPC.call(this.pieceColor, this._selectedPiece.id(), data.x, data.y)

        this._resetSelection()
    }

    isRockAvailable() {
        return this.isRockAvailableBy(this.pieceColor)
    }

    isRockAvailableBy(playerColor: PieceColor) {
        if (playerColor === PieceColor.White) {
            return this.board.whiteRockAvailable.get()
        } else {
            return this.board.blackRockAvailable.get()
        }
    }

    isRockPlayable() {
        return this.isRockPlayableBy(this.pieceColor)
    }

    isRockPlayableBy(playerColor: PieceColor) {
        if (this.board.turn.get() !== playerColor)
            return false

        if (!this.isRockAvailableBy(playerColor))
            return false

        const y = playerColor === PieceColor.White ? 0 : 7
        const cells = this._computeCells()

        if (cells[5][y] !== null || cells[6][y] !== null)
            return false

        return true
    }

    playRock() {
        this.playRockRPC.call(this.pieceColor)
        this._resetSelection()
    }

    private _nextTurn() {
        // Change turn
        this.board.turn.set(this.board.turn.get() === PieceColor.White ? PieceColor.Black : PieceColor.White)

        this.model.tick()
    }

    private _resetSelection() {
        this._selectedPiece = null
        EventManager.emitter.emit('selectCells', [])
    }

    private _consumeRock(playerColor: PieceColor) {
        if (playerColor === PieceColor.White) {
            this.board.whiteRockAvailable.set(false)
        } else {
            this.board.blackRockAvailable.set(false)
        }
    }

    protected playRockRPC = RPC.host((playerColor: PieceColor) => {
        if (!this.isRockPlayableBy(playerColor))
            return

        const cells = this._computeCells()
        const y = playerColor === PieceColor.White ? 0 : 7
        const king = cells[4][y]
        const tower = cells[7][y]

        if (!king || !tower)
            return

        king.position.get().x = 6
        tower.position.get().x = 5

        this._consumeRock(playerColor)

        // Change turn
        this._nextTurn()
    })

    protected playMoveRPC = RPC.host((playerColor: PieceColor, pieceId: string, x: number, y: number) => {
        console.log("asking to play move", playerColor, pieceId, x, y, this.board.turn.get())

        // Not our turn
        if (this.board.turn.get() !== playerColor)
            return

        const piece = [...this.board.pieces.values()].find(piece => piece.id() === pieceId)

        if (!piece)
            return

        // Illegal for this piece
        if (!this._isMoveAllowed(piece, { x, y }))
            return

        if (
            piece.shape.get() === PieceShape.King ||
            (piece.shape.get() === PieceShape.Tower && piece.position.get().x === 7)
        ) {
            this._consumeRock(playerColor)
        }

        // Kill old piece
        for (const piece of this.board.pieces.values()) {
            if (piece.position.get().x === x && piece.position.get().y === y) {
                this.board.pieces.remove(piece)
                break
            }
        }

        // Move piece
        piece.position.get().x = x
        piece.position.get().y = y

        this._nextTurn()
    })

}

