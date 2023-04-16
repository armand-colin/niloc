import { SyncObject, SyncObjectRefSetField, Template } from "niloc-core";
import { Piece } from "./Piece";

export class Board extends SyncObject {

    static template = Template.create("Board", Board)

    readonly pieces = new SyncObjectRefSetField<Piece>()

}