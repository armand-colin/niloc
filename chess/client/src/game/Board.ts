import { AnyField, SyncObject, SyncObjectRefSetField, Template } from "niloc-core";
import { Piece, PieceColor } from "./Piece";

export class Board extends SyncObject {

    static template = Template.create("Board", Board)

    readonly pieces = new SyncObjectRefSetField<Piece>()
    readonly turn = new AnyField<PieceColor>(PieceColor.White)
    readonly whiteRockAvailable = new AnyField<boolean>(true)
    readonly blackRockAvailable = new AnyField<boolean>(true)

}