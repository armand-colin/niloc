import { Emitter } from "niloc-core"
import { Piece } from "./Piece"

interface Events {
    pieceClick: { event: React.MouseEvent, piece: Piece }
    selectCells: { x: number, y: number }[]
    cellClick: { x: number, y: number }
}

export namespace EventManager {

    export const emitter = new Emitter<Events>()

}