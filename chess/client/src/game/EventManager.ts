import { Emitter } from "utils"
import { Piece } from "./Piece"

interface Events {
    pieceClick: { event: React.MouseEvent, piece: Piece }
    selectCells: { x: number, y: number }[]
}

export namespace EventManager {

    export const emitter = new Emitter<Events>()

}