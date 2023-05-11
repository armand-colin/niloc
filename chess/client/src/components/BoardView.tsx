import "./BoardView.scss"
import { PropsWithChildren, useEffect, useMemo, useState } from "react"
import { Board } from "../game/Board"
import { PieceView } from "./PieceView"
import { EventManager } from "../game/EventManager"
import { useField } from "../hooks/useField"
import { PieceColor } from "../game/Piece"

interface Props {
    board: Board,
    color: PieceColor
}

type CellMetaData = {
    selected: boolean
}

const Cells = (props: { reverse?: boolean }) => {
    const [selectedCells, setSelectedCells] = useState<{ x: number, y: number }[]>([])

    useEffect(() => {
        EventManager.emitter.on('selectCells', setSelectedCells)
        return () => {
            EventManager.emitter.off('selectCells', setSelectedCells)
        }
    }, [])

    const cells = useMemo(() => {
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
                if (props.reverse) {
                    // Reversing y axis
                    i = 7 - i
                }

                return <div className="Cells__row" key={i}>
                    {
                        Array(8).fill(null).map((__, j) => {
                            if (props.reverse) {
                                // Reversing y axis
                                j = 7 - j
                            }

                            const className = [
                                "Cells__cell",
                                (i + j) % 2 ? "odd" : "even",
                                cells[j][7 - i].selected ? "selected" : ""
                            ].join(' ')

                            return <div 
                                className={className} 
                                key={j} 
                                onClick={() => onClick(j, 7 - i)}
                            ></div>
                        })
                    }
                </div>
            })
        }
    </div>
}

const Grid = (props: PropsWithChildren<{ reverse?: boolean }>) => {
    return <div className="Grid">
        <Cells reverse={props.reverse} />
        <div className="Grid__content">
            {props.children}
        </div>
    </div>
}

export const BoardView = (props: Props) => {
    useField(props.board.pieces)

    const pieces = [...props.board.pieces.values()]
    const reverse = props.color !== PieceColor.White

    return <div className="BoardView">
        <Grid
            reverse={reverse}
        >
            {
                pieces.map(piece => {
                    return <PieceView
                        reverse={reverse}
                        key={piece.id()}
                        piece={piece}
                    />
                })
            }
        </Grid>
    </div>
}