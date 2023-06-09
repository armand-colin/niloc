import { Piece, PieceColor, PieceShape } from "./Piece"

type PieceData = {
    shape: PieceShape,
    color: PieceColor
    x: number,
    y: number,
}

type Moves = (piece: PieceData, cells: (PieceData | null)[][]) => { x: number, y: number }[]

function isAlly(piece: PieceData, cells: (PieceData | null)[][], move: { x: number, y: number }) {
    return cells[move.x][move.y] !== null && cells[move.x][move.y]!.color === piece.color
}

function isEnemy(piece: PieceData, cells: (PieceData | null)[][], move: { x: number, y: number }) {
    return cells[move.x][move.y] !== null && cells[move.x][move.y]!.color !== piece.color
}

function isOccupied(cells: (PieceData | null)[][], move: { x: number, y: number }) {
    return cells[move.x][move.y] !== null
}

function isInBounds(move: { x: number, y: number }) {
    return move.x >= 0 && move.x < 8 && move.y >= 0 && move.y < 8
}

function filterAlly(piece: PieceData, cells: (PieceData | null)[][], moves: { x: number, y: number }[]) {
    return moves.filter(move => !isAlly(piece, cells, move))
}

function filterOccupied(cells: (PieceData | null)[][], moves: { x: number, y: number }[]) {
    return moves.filter(move => !isOccupied(cells, move))
}

function filterNotInBounds(moves: { x: number, y: number }[]) {
    return moves.filter(move => isInBounds(move))
}

const PawnMoves: Moves = (piece, cells) => {
    let moves: { x: number, y: number }[] = []
    const x = piece.x
    const y = piece.y

    let starting = false
    if (piece.color === PieceColor.White) {
        starting = y === 1
    } else {
        starting = y === 6
    }

    let direction = piece.color === PieceColor.White ? 1 : -1

    moves.push({ x: x, y: y + direction })
    if (starting)
        moves.push({ x: x, y: y + direction * 2 })

    moves = filterNotInBounds(moves)
    moves = filterOccupied(cells, moves)

    const d1 = { x: x + 1, y: y + direction }
    const d2 = { x: x - 1, y: y + direction }
    if (isInBounds(d1) && isEnemy(piece, cells, d1))
        moves.push(d1)
    if (isInBounds(d2) && isEnemy(piece, cells, d2))
        moves.push(d2)

    moves = filterNotInBounds(moves)

    return moves
}

const KingMoves: Moves = (piece, cells) => {
    let moves: { x: number, y: number }[] = []
    const x = piece.x
    const y = piece.y

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0)
                continue
            moves.push({ x: x + i, y: y + j })
        }
    }

    moves = filterNotInBounds(moves)
    moves = filterAlly(piece, cells, moves)

    return moves
}

const TowerMoves: Moves = (piece, cells) => {
    let moves: { x: number, y: number }[] = []
    const x = piece.x
    const y = piece.y

    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ]

    for (const direction of directions) {
        for (let i = 1; i < 8; i++) {
            const move = { x: x + direction.x * i, y: y + direction.y * i }
            if (!isInBounds(move))
                break
            if (isAlly(piece, cells, move))
                break
            moves.push(move)
            if (isEnemy(piece, cells, move))
                break
        }
    }

    return moves
}

const BishopMoves: Moves = (piece, cells) => {
    let moves: { x: number, y: number }[] = []
    const x = piece.x
    const y = piece.y

    const directions = [
        { x: 1, y: 1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 },
    ]

    for (const direction of directions) {
        for (let i = 1; i < 8; i++) {
            const move = { x: x + direction.x * i, y: y + direction.y * i }
            if (!isInBounds(move))
                continue
            if (isAlly(piece, cells, move))
                break
            moves.push(move)
            if (isEnemy(piece, cells, move))
                break
        }
    }

    return moves
}

const KnightMoves: Moves = (piece, cells) => {
    let moves: { x: number, y: number }[] = []
    const x = piece.x
    const y = piece.y

    const directions = [
        { x: 2, y: 1 },
        { x: 2, y: -1 },
        { x: -2, y: -1 },
        { x: -2, y: -1 },
        { x: 1, y: 2 },
        { x: 1, y: -2 },
        { x: -1, y: -2 },
        { x: -1, y: 2 },
    ]

    for (const direction of directions) {
        const move = { x: x + direction.x, y: y + direction.y }
        if (!isInBounds(move))
            continue
        if (isAlly(piece, cells, move))
            continue
        moves.push(move)
    }

    return moves
}

const QueenMoves: Moves = (piece, cells) => {
    return [...TowerMoves(piece, cells), ...BishopMoves(piece, cells)]
}

function pieceToPieceData(piece: Piece): PieceData {
    const data: PieceData = {
        color: piece.color.get(),
        shape: piece.shape.get(),
        x: piece.position.get().x,
        y: piece.position.get().y,
    }
    return data
}

export const PieceMoves = (piece: Piece, cells: (Piece | null)[][]) => {
    const pieceData: PieceData = pieceToPieceData(piece)
    const cellsData = cells.map(array => array.map(value => value ? pieceToPieceData(value) : null))
    return PieceDataMoves(pieceData, cellsData)
}

export const PieceDataMoves: Moves = (piece, cells) => {
    switch (piece.shape) {
        case PieceShape.Bishop: return BishopMoves(piece, cells);
        case PieceShape.Tower: return TowerMoves(piece, cells);
        case PieceShape.Pawn: return PawnMoves(piece, cells);
        case PieceShape.King: return KingMoves(piece, cells);
        case PieceShape.Queen: return QueenMoves(piece, cells);
        case PieceShape.Knight: return KnightMoves(piece, cells);
    }
}