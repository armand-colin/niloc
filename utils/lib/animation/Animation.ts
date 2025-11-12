import { nanoid } from "nanoid";
import { Duration } from "../Duration";
import { AnimationCurve } from "./AnimationCurve";

export class Animation {

    readonly id = nanoid()

    private _callback: (t: number) => void
    private _duration: Duration
    private _time: Duration
    private _curve: AnimationCurve

    constructor(curve: AnimationCurve, duration: Duration, callback: (t: number) => void) {
        this._curve = curve
        this._duration = duration
        this._callback = callback
        this._time = { milliseconds: 0 }
    }

    get finished(): boolean {
        return this._time.milliseconds >= this._duration.milliseconds
    }

    cancel() {
        this._time.milliseconds = this._duration.milliseconds
    }

    update(delta: Duration) {
        if (this.finished)
            return

        this._time.milliseconds += delta.milliseconds

        const time = Math.min(this._time.milliseconds, this._duration.milliseconds)
        const t = this._curve.sample(time / this._duration.milliseconds)
        this._callback(t)
    }

}