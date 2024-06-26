import { Iter } from "@niloc/utils"

type NumberArray = number[] | Float32Array | Float64Array 

export class Serie implements Iterable<number> {

    private _iter: Iter<number>

    constructor(protected readonly array: NumberArray) {
        this._iter = new Iter(array)
    }

    get length() {
        return this.array.length
    }

    [Symbol.iterator]() {
        return this._iter[Symbol.iterator]()
    }

}