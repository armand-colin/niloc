import "./BoardView.scss"
import { PropsWithChildren } from "react"
import { Board } from "../game/Board"
import { PieceView } from "./PieceView"

interface Props {
    board: Board
}

const cells = Array(8).fill(null)
    .map(_ => Array(8).fill(null).map((_, i) => <div className="Grid__cell" key={i}></div>))
    .map((array, i) => <div className="Grid__row" key={i}>{array}</div>)

const Grid = (props: PropsWithChildren<{}>) => {
    return <div className="Grid">
        {cells}
        <div className="Grid__content">
            {props.children}
        </div>
    </div>
}

export const BoardView = (props: Props) => {
    const pieces = [...props.board.pieces.values()]
    return <div className="BoardView">
        <h1>Board</h1>
        <Grid>
            {
                pieces.map(piece => {
                    return <PieceView key={piece.id()} piece={piece} />
                })
            }
        </Grid>
    </div>
}