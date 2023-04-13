import { ChangeRequester, Reader, Writer } from "../Synchronize";
export declare abstract class Field {
    static setIndex(field: Field, index: number): void;
    static setChangeRequester(field: Field, requester: ChangeRequester): void;
    private _index;
    private _changeRequester;
    index(): number;
    abstract read(reader: Reader): void;
    abstract write(writer: Writer): void;
    protected changed(): void;
}
