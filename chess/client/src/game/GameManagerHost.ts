import { Address, Message } from "niloc-core"
import { Board } from "./Board"
import { GameManager } from "./GameManager"
import { Piece, PieceColor, PieceShape } from "./Piece"

export class GameManagerHost extends GameManager {

    public readonly board: Board

    constructor(color: PieceColor) {
        super(color)
        this.board = this.model.instantiate(Board.template, "board")
        this._initBoard()
        this.model.tick()
        const connectionChannel = this.application.channel<any>(0)
        connectionChannel.addListener(this._onConnectionMessage)
    }

    private _initBoard() {
        // Pawns
        for (let i = 0; i < 8; i++) {
            this._createPiece(PieceShape.Pawn, PieceColor.White, i, 1)
            this._createPiece(PieceShape.Pawn, PieceColor.Black, i, 6)
        }

        // Towers
        this._createPiece(PieceShape.Tower, PieceColor.White, 0, 0)
        this._createPiece(PieceShape.Tower, PieceColor.White, 7, 0)
        this._createPiece(PieceShape.Tower, PieceColor.Black, 0, 7)
        this._createPiece(PieceShape.Tower, PieceColor.Black, 7, 7)

        // Bishops
        this._createPiece(PieceShape.Bishop, PieceColor.White, 2, 0)
        this._createPiece(PieceShape.Bishop, PieceColor.White, 5, 0)
        this._createPiece(PieceShape.Bishop, PieceColor.Black, 2, 7)
        this._createPiece(PieceShape.Bishop, PieceColor.Black, 5, 7)
        
        // Knights
        this._createPiece(PieceShape.Knight, PieceColor.White, 1, 0)
        this._createPiece(PieceShape.Knight, PieceColor.White, 6, 0)
        this._createPiece(PieceShape.Knight, PieceColor.Black, 1, 7)
        this._createPiece(PieceShape.Knight, PieceColor.Black, 6, 7)
        
        // Kings
        this._createPiece(PieceShape.King, PieceColor.White, 4, 0)
        this._createPiece(PieceShape.King, PieceColor.Black, 4, 7)
        
        // Queens
        this._createPiece(PieceShape.Queen, PieceColor.White, 3, 0)
        this._createPiece(PieceShape.Queen, PieceColor.Black, 3, 7)
    }

    private _createPiece(shape: PieceShape, color: PieceColor, x: number, y: number) {
        const piece = this.model.instantiate(Piece.template)

        piece.color.set(color)
        piece.shape.set(shape)
        piece.position.get().x.set(x)
        piece.position.get().y.set(y)

        this.board.pieces.add(piece)

        return piece
    }

    private _onConnectionMessage = (message: Message<any>) => {
        const peerId = message.data.connected        
        if (peerId && peerId !== this.application.id)
            this.model.syncTo(Address.to(peerId))
    }

}