import "./TurnView.scss"
import { Board } from "../game/Board";
import { PieceColor } from "../game/Piece";
import { useField } from "../hooks/useField";

export const TurnView = (props: { board: Board; color: PieceColor; }) => {
    useField(props.board.turn);

    const turn = props.board.turn.get();

    return <div className={"TurnView"}>
        <div className={"TurnView__slider"}>
            <div className={"TurnView__knob " + (props.color === turn ? "down" : "up")}></div>
        </div>
    </div>
};
