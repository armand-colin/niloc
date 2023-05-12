import "./RockView.scss"
import { Board } from "../game/Board";
import { GameManager } from "../game/GameManager";
import { useField } from "../hooks/useField";
import { Button } from "./atoms/Button";

export const RockView = (props: { gameManager: GameManager; board: Board; }) => {
    useField(props.board.turn);
    const rockAvailable = props.gameManager.isRockAvailable();
    const rockPlayable = props.gameManager.isRockPlayable();

    function onClick() {
        if (rockPlayable)
            props.gameManager.playRock();
    }

    if (!rockAvailable)
        return <></>;

    return <div className="RockView">
        <Button disabled={!rockPlayable} onClick={onClick}>Rock</Button>
    </div>
};
