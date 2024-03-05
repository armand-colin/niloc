export class Time {

    private _delta: number = 0

    now() {
        return Date.now() + this._delta
    }

    setDelta(delta: number) {
        this._delta = delta
    }

}