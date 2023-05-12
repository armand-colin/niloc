import "./RawPieceView.scss"
import { PieceColor, PieceShape } from "../game/Piece"
import pawn from "../assets/pieces/pawn.svg"
import bishop from "../assets/pieces/bishop.svg"
import tower from "../assets/pieces/tower.svg"
import king from "../assets/pieces/king.svg"
import queen from "../assets/pieces/queen.svg"
import knight from "../assets/pieces/knight.svg"
import { useUrl } from "../hooks/useUrl";
import React from "react";

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

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "shape" | "color"> & {
    shape: PieceShape,
    color: PieceColor
}

function removeKeys<T, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
    const value: any = object
    for (const key of keys)
        delete value[key]
    return value
}

export const RawPieceView = (props: Props) => {
    const className = "RawPieceView " + (props.className ?? "")

    const shape = props.shape
    const color = props.color

    const divProps = removeKeys({...props}, "shape", "color")

    return <div
        {...divProps}
        className={className}
    >
        {ShapeView(shape, color)}
    </div>
}