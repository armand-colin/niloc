import { ChangeRequester, Reader, Writer } from "../Synchronize"

export abstract class Field {

    public static setIndex(field: Field, index: number) {
        field._index = index
    }
    
    public static setChangeRequester(field: Field, requester: ChangeRequester) {
        field._changeRequester = requester
    }

    private _index: number = -1
    private _changeRequester: ChangeRequester | null = null

    index() { return this._index }

    abstract read(reader: Reader): void
    abstract write(writer: Writer): void

    protected changed(): void  {
        this._changeRequester?.change()
    }

}