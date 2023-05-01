import "./PieceView.scss"
import { Piece, PieceColor, PieceShape } from "../game/Piece"
import { EventManager } from "../game/EventManager";
import { useField } from "../hooks/useField";
import pawn from "../assets/pieces/pawn.svg"
import bishop from "../assets/pieces/bishop.svg"
import tower from "../assets/pieces/tower.svg"
import king from "../assets/pieces/king.svg"
import queen from "../assets/pieces/queen.svg"
import knight from "../assets/pieces/knight.svg"
import { useUrl } from "../hooks/useUrl";

interface Props {
    piece: Piece,
}

const ShapeView = (shape: PieceShape, color: PieceColor) => {
    let svgUrl: string;

    switch (shape) {
        case PieceShape.Pawn:
            svgUrl = pawn
            break
        case PieceShape.Bishop:
            svgUrl = bishop
            break
        case PieceShape.Tower:
            svgUrl = tower
            break
        case PieceShape.Knight:
            svgUrl = knight
            break
        case PieceShape.King:
            svgUrl = king
            break
        case PieceShape.Queen:
            svgUrl = queen
            break
    }

    const svg = useUrl(svgUrl)
    
    const className = [
        "ShapeView",
        color === PieceColor.White ? "white" : "black"
    ].join(' ')

    return <div className={className} dangerouslySetInnerHTML={{ __html: svg ?? "" }}></div>
}

export const PieceView = (props: Props) => {
    useField(props.piece.shape)
    useField(props.piece.color)
    useField(props.piece.position)

    const shape = props.piece.shape.get()
    const color = props.piece.color.get()
    const x = props.piece.position.get().x.get()
    const y = props.piece.position.get().y.get()

    function onClick(e: React.MouseEvent) {
        EventManager.emitter.emit("cellClick", { x, y })
        EventManager.emitter.emit("pieceClick", { event: e, piece: props.piece })
    }

    return <div
        className="PieceView"
        style={{
            // @ts-ignore
            "--color": color === PieceColor.White ? "white" : "black",
            // @ts-ignore
            "--x": x,
            // @ts-ignore
            "--y": y
        }}
        onClick={onClick}
    >
        {ShapeView(shape, color)}
    </div>
}