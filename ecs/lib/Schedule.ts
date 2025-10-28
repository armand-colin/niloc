import { Duration } from "@niloc/utils"

type Callback = () => void


export abstract class Schedule {

    private _callbacks: Callback[] = []
    private _before: Callback[] = []
    private _after: Callback[] = []

    protected trigger() {
        for (const callback of this._before)
            callback()

        const callbacks = this._callbacks
        this._callbacks = []
        for (const callback of callbacks)
            callback()

        for (const callback of this._after)
            callback()
    }

    before(callback: Callback): void {
        this._before.push(callback)
    }

    next(callback: Callback): void {
        this._callbacks.push(callback)
    }

    after(callback: Callback): void {
        this._after.push(callback)
    }

}

class FrameSchedule extends Schedule {

    private _running = true
    private _frameRequest: number | null = null

    next(callback: Callback): void {
        super.next(callback)

        if (this._frameRequest === null && this._running)
            this._frameRequest = requestAnimationFrame(this.trigger.bind(this))
    }

    start() {
        if (this._running)
            return

        this._running = true

        if (this._frameRequest === null)
            this._frameRequest = requestAnimationFrame(this.trigger.bind(this))
    }

    pause() {
        if (this._running === false)
            return

        this._running = false

        if (this._frameRequest !== null) {
            cancelAnimationFrame(this._frameRequest)
            this._frameRequest = null
        }
    }

    trigger(): void {
        this._frameRequest = null
        super.trigger()
    }

}

class TimeoutSchedule extends Schedule {

    constructor(duration: Duration) {
        super()
        setTimeout(this.trigger.bind(this), duration.milliseconds)
    }

}

class IntervalSchedule extends Schedule {

    private _interval: Duration
    private _intervalId: number | null = null
    private _running = true

    constructor(interval: Duration) {
        super()
        this._interval = interval
        this._intervalId = setInterval(this.trigger.bind(this), this._interval.milliseconds, undefined)
    }

    start() {
        if (this._running)
            return

        this._running = true

        this._intervalId = setInterval(this.trigger.bind(this), this._interval.milliseconds, undefined)
    }

    pause() {
        if (!this._running)
            return

        this._running = false

        if (this._intervalId !== null) {
            clearInterval(this._intervalId)
            this._intervalId = null
        }
    }

}

class AfterSchedule extends Schedule {

    constructor(schedule: Schedule) {
        super()
        schedule.after(this.trigger.bind(this))
    }

}

class BeforeSchedule extends Schedule {

    constructor(schedule: Schedule) {
        super()
        schedule.before(this.trigger.bind(this))
    }

}


export namespace Schedule {

    export const Frame = new FrameSchedule()

    export const waitForSeconds = (seconds: number) => new TimeoutSchedule(Duration.fromSeconds(seconds))
    export const waitForDuration = (duration: Duration) => new TimeoutSchedule(duration)

    export const interval = (duration: Duration) => new IntervalSchedule(duration)

    export const after = (schedule: Schedule) => new AfterSchedule(schedule)
    export const before = (schedule: Schedule) => new BeforeSchedule(schedule)

}