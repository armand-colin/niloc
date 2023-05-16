import { PieceDataMoves } from "./MovesUtils";
import { PieceColor, PieceShape } from "./Piece";

interface Piece {
    shape: PieceShape,
    color: PieceColor,
    x: number,
    y: number
}

function find<T>(iterable: IterableIterator<T>, predicate: (value: T) => boolean): T | null {
    for (const value of iterable)
        if (predicate(value))
            return value
    return null
}

class ChessBoard {

    private _turn: PieceColor
    private readonly _pieces: (Piece | null)[][]
    private _check: boolean | null = null
    private _checkmate: boolean | null = null

    constructor(turn: PieceColor, pieces: Piece[]) {
        this._turn = turn
        this._pieces = Array(8).fill(null).map(() => Array(8).fill(null))
        for (const piece of pieces)
            this._pieces[piece.x][piece.y] = piece
    }

    static fromSR(sr: string): ChessBoard {
        const { turn, pieces } = ChessBoardSR.fromString(sr)
        return new ChessBoard(turn, pieces)
    }

    sr(): string {
        const pieces = [...this.pieces()]
        return ChessBoardSR.toString(this._turn, pieces)
    }

    *pieces(): IterableIterator<Piece> {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const piece = this._pieces[x][y]
                if (piece)
                    yield piece
            }
        }
    }

    check(): boolean {
        if (this._check === null)
            this._check = this._computeCheck()
        return this._check
    }

    checkmate(): boolean {
        if (this._checkmate === null)
            this._checkmate = this._computeCheckmate()
        return this._checkmate
    }

    // Check if the current turn is check
    private _computeCheck(): boolean {
        // Shall find king
        const king = find(this.pieces(), piece => piece.shape === PieceShape.King && piece.color === this._turn)
        
        if (king === null)
            return true
        
        // Shall compute all opponents' moves
        for (const piece of this.pieces()) {
            if (piece.color === this._turn)
                continue
            
            for (const position of this._getPieceMoves(piece)) {
                if (position.x === king.x && position.y === king.y)
                    return true
            }
        }

        return false
    }

    private _computeCheckmate(): boolean {
        if (!this.check())
            return false

        return false
    }

    private *_getPieceMoves(piece: Piece): IterableIterator<{ x: number, y: number }> {
        const moves = PieceDataMoves(piece, this._pieces)
        yield *moves
    }

}

const shapeToString: Record<PieceShape, string> = {
    [PieceShape.Bishop]: 'b',
    [PieceShape.King]: 'k',
    [PieceShape.Pawn]: 'p',
    [PieceShape.Knight]: 'c',
    [PieceShape.Queen]: 'q',
    [PieceShape.Tower]: 't'
}

const stringToShape: Record<string, PieceShape> = Object.entries(shapeToString)
    .reduce((acc, [key, value]) => {
        acc[value] = key
        return acc
    }, {} as any)

const columnToLetter: string[] = Array(8)
    .fill(null)
    .map((_, i) => String.fromCharCode('a'.charCodeAt(0) + i))

const letterToColumn: Record<string, number> = columnToLetter
    .reduce((acc, letter, i) => Object.assign(acc, { [letter]: i }), {} as any)

namespace ChessBoardSR {

    export function fromString(sr: string): { turn: PieceColor, pieces: Piece[] } {
        const turn = sr[0] === "0" ? PieceColor.White : PieceColor.Black
        const pieces: Piece[] = []
        let index = 1
        while (index < sr.length) {
            const shape = stringToShape[sr[index].toLowerCase()]
            const color = sr[index].toLowerCase() === sr[index] ? PieceColor.White : PieceColor.Black
            const x = parseInt(sr[index + 1])
            const y = letterToColumn[sr[index + 2]]
            pieces.push({
                shape,
                color,
                x, y
            })
            index += 3
        }
        return { turn, pieces }
    }

    export function toString(turn: PieceColor, pieces: Piece[]) {
        let string = ""
        string += turn === PieceColor.White ? "0" : "1"
        for (const piece of pieces) {
            let type = shapeToString[piece.shape]
            if (piece.color === PieceColor.Black)
                type = type.toUpperCase()
            const x = piece.x
            const y = columnToLetter[piece.y]
            string += type
            string += x
            string += y
        }
        return string
    }

}