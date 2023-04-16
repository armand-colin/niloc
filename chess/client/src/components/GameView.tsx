import { Board } from "../game/Board"
import { GameManager } from "../game/GameManager"
import { useObject } from "../hooks/useObject"
import { BoardView } from "./BoardView"

interface Props {
    gameManager: GameManager
}

export const GameView = (props: Props) => {
    const board = useObject<Board>(props.gameManager.model, "board")

    return <div className="GameView">
        {board && <BoardView board={board} />}
    </div>
}