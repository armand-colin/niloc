import "./PieceView.scss"
import { Piece, PieceColor, PieceShape } from "../game/Piece"

interface Props {
    piece: Piece
}

const ShapeView = (shape: PieceShape) => {
    let letter: string;
    switch (shape) {
        case PieceShape.Pawn:
            letter = "P"
            break
        case PieceShape.Bishop:
            letter = "B"
            break
        case PieceShape.Tower:
            letter = "T"
            break
        case PieceShape.Knight:
            letter = "C"
            break
        case PieceShape.King:
            letter = "K"
            break
        case PieceShape.Queen:
            letter = "Q"
            break
    }

    return <div className="ShapeView">{letter}</div>
}

export const PieceView = (props: Props) => {
    const shape = props.piece.shape.get()
    const color = props.piece.color.get()
    const x = props.piece.position.get().x.get()
    const y = props.piece.position.get().y.get()

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
    >
        {ShapeView(shape)}
    </div>
}