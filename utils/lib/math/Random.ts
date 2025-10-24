import { Vec2 } from "./Vec2"

const MAX_UINT32 = 2 ** 32

export class Random {

    private _i = 0

    constructor(readonly seed: number) { }

    next(): number {
        const a = 1664525
        const c = 1013904223
        const m = MAX_UINT32

        this._i = (a * this._i + c) % m
        return (this.seed + this._i) % m / m
    }

}

export class Random2D {

    constructor(readonly seed: number) { }

    get(uv: Vec2): number {
        const a = 1664525
        const c = 1013904223
        const m = MAX_UINT32

        let i = Math.floor(uv.x) * 374761393 + Math.floor(uv.y) * 668265263 + this.seed * 2246822519
        i = (a * i + c) % m
        return i / m
    }

}