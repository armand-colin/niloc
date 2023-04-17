import "./BoardView.scss"
import { PropsWithChildren, useEffect, useMemo, useState } from "react"
import { Board } from "../game/Board"
import { PieceView } from "./PieceView"
import { EventManager } from "../game/EventManager"
import { useField } from "../hooks/useField"

interface Props {
    board: Board
}

type CellMetaData = {
    selected: boolean
}

const Cells = () => {
    const [selectedCells, setSelectedCells] = useState<{ x: number, y: number }[]>([])

    useEffect(() => {
        EventManager.emitter.on('selectCells', setSelectedCells)
        return () => {
            EventManager.emitter.off('selectCells', setSelectedCells)
        }
    }, [])

    const cells = useMemo(() => {
        console.log("selected changed", selectedCells);

        const cells: CellMetaData[][] = Array(8).fill(null).map(() => Array(8).fill(null).map(_ => ({ selected: false })))
        for (const { x, y } of selectedCells)
            cells[x][y].selected = true
        return cells
    }, [selectedCells])

    function onClick(x: number, y: number) {
        EventManager.emitter.emit('cellClick', { x, y })
    }

    return <div className="Cells">
        {
            Array(8).fill(null).map((_, i) => {
                return <div className="Cells__row" key={i}>
                    {
                        Array(8).fill(null).map((__, j) => {
                            const className = [
                                "Cells__cell",
                                (i + j) % 2 ? "odd" : "even",
                                cells[j][7 - i].selected ? "selected" : ""
                            ].join(' ')
                            return <div className={className} key={j} onClick={() => onClick(j, 7 - i)}>

                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}

const Grid = (props: PropsWithChildren<{}>) => {
    return <div className="Grid">
        <Cells />
        <div className="Grid__content">
            {props.children}
        </div>
    </div>
}

export const BoardView = (props: Props) => {
    useField(props.board.pieces)
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