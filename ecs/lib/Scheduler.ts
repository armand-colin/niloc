import { Time } from "../sound/Time";
import type { Coroutine } from "./Coroutine";
import { Schedule, SCHEDULES_COUNT } from "./Schedule";

export abstract class Bucket {

    coroutines: Coroutine[] = []

    add(coroutine: Coroutine) {

    }

    handle() {

    }

}

export class Scheduler<S> {

    private _buckets = new Map<S, Bucket>()

    private _frameRequest: number | null = null
    private _audioProcessingInterval: number | null = null

    constructor() {
        this._buckets = Array(SCHEDULES_COUNT).fill(null).map(() => [])

        this._frameRequest = requestAnimationFrame(this._handleFrame)
        this._audioProcessingInterval = setInterval(this._handleAudioProcessing, Time.audioInterval.milliseconds, undefined)
    }

    add(coroutine: Coroutine) {
        this._handle(coroutine)
    }

    private _handle(coroutine: Coroutine) {
        const next = coroutine.next()
        if (next.done)
            return

        this._buckets[next.value].push(coroutine)
    }

    private _handleBucket(schedule: Schedule) {
        const bucket = [...this._buckets[schedule]]
        this._buckets[schedule].length = 0

        for (const coroutine of bucket)
            this._handle(coroutine)
    }

    private _handleAudioProcessing = () => {
        this._handleBucket(Schedule.AudioPreProcessing)
        this._handleBucket(Schedule.AudioProcessing)
    }

    private _handleFrame = () => {
        this._handleBucket(Schedule.Frame)
        this._frameRequest = requestAnimationFrame(this._handleFrame)
    }

}