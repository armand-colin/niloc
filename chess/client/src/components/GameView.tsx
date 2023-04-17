import { Board } from "../game/Board"
import { GameManager } from "../game/GameManager"
import { PieceColor } from "../game/Piece"
import { useField } from "../hooks/useField"
import { useObject } from "../hooks/useObject"
import { BoardView } from "./BoardView"

interface Props {
    gameManager: GameManager
}

export const GameView = (props: Props) => {
    const board = useObject<Board>(props.gameManager.model, "board")

    return <div className="GameView">
        {board && <BoardView board={board} />}
        {board && <TurnView board={board} />}
        {board && <RockView board={board} gameManager={props.gameManager} />}
    </div>
}

const TurnView = (props: { board: Board }) => {
    useField(props.board.turn)
    const turn = props.board.turn.get()

    return <div className="TurnView">
        {turn == PieceColor.White ? "Whites playing" : "Blacks playing"}
    </div>
}

const RockView = (props: { gameManager: GameManager, board: Board }) => {
    useField(props.board.turn)
    const rockAvailable = props.gameManager.isRockAvailable()
    const rockPlayable = props.gameManager.isRockPlayable()

    function onClick() {
        if (rockPlayable)
            props.gameManager.playRock()
    }

    if (!rockAvailable)
        return <></>

    return <button disabled={!rockPlayable} onClick={onClick}>Rock</button>
}