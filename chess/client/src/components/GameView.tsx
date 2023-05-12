import "./GameView.scss"
import { Board } from "../game/Board"
import { GameManager } from "../game/GameManager"
import { useObject } from "../hooks/useObject"
import { BoardView } from "./BoardView"
import { TurnView } from "./TurnView"
import { RockView } from "./RockView"

interface Props {
    gameManager: GameManager
}

export const GameView = (props: Props) => {
    const board = useObject<Board>(props.gameManager.model, "board")

    return <div className="GameView">
        {board && <BoardView board={board} color={props.gameManager.pieceColor} />}
        {board && <TurnView board={board} color={props.gameManager.pieceColor} />}
        {board && <RockView board={board} gameManager={props.gameManager} />}
    </div>
}

