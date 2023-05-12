import "./PieceView.scss"
import { Piece, PieceColor } from "../game/Piece"
import { EventManager } from "../game/EventManager";
import { useField } from "../hooks/useField";
import { RawPieceView } from "./RawPieceView";

interface Props {
    piece: Piece,
    reverse?: boolean
}

export const PieceView = (props: Props) => {
    useField(props.piece.shape)
    useField(props.piece.color)
    useField(props.piece.position)

    const shape = props.piece.shape.get()
    const color = props.piece.color.get()
    const x = props.piece.position.get().x
    const y = props.piece.position.get().y

    function onClick(e: React.MouseEvent) {
        console.log('click', props.piece.id());
        EventManager.emitter.emit("cellClick", { x, y })
        EventManager.emitter.emit("pieceClick", { event: e, piece: props.piece })
    }

    const displayX = props.reverse ? 7 - x : x
    const displayY = props.reverse ? 7 - y : y

    return <RawPieceView
        color={color}        
        shape={shape}
        onClick={onClick}
        className="PieceView"
        style={{
            // @ts-ignore
            "--color": color === PieceColor.White ? "white" : "black",
            // @ts-ignore
            "--x": displayX,
            // @ts-ignore
            "--y": displayY
        }}
    />
}