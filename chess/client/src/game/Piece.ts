import { AnyField, SyncObject, SyncObjectField, Template } from "niloc-core";
import { Position } from "./Position";

export enum PieceShape {
    Pawn,
    Tower,
    Knight,
    Bishop,
    King,
    Queen
}

export enum PieceColor {
    White,
    Black
}

export class Piece extends SyncObject {

    static template = Template.create("Piece", Piece)

    readonly shape = new AnyField(PieceShape.Pawn)
    readonly color = new AnyField(PieceColor.White)
    readonly position = new SyncObjectField(Position.template)

}