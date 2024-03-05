import { Channel } from "../channel/Channel";
import { Identity } from "../core/Identity";
import { Message } from "../core/Message";
import { Address } from "../core/Address";
import { Time } from "./Time";

enum TimeSynchronizerMessageType {
    Query = 0,
    Response = 1
}

type TimeSynchronizerMessage =
    [TimeSynchronizerMessageType.Query, number] |
    [TimeSynchronizerMessageType.Response, number, number]

export type TimeSynchronizerOpts = {
    channel: Channel<TimeSynchronizerMessage>,
    time: Time,
    identity: Identity,
    /**
     * The frequency at which to send time sync queries in milliseconds.
     * @default 60_000
     */
    frequency?: number
}

const FREQUENCY = 60_000

type TimeQuery = {
    i: number,
    localTimestamp: number
}

export class TimeSynchronizer {

    private _time: Time
    private _host: boolean
    private _channel: Channel<TimeSynchronizerMessage>

    private _queryIndex: number = 0
    private _query: TimeQuery | null = null

    private _interval: NodeJS.Timeout | null = null

    constructor(opts: TimeSynchronizerOpts) {
        this._time = opts.time
        this._host = opts.identity.host
        this._channel = opts.channel

        if (!this._host)
            this._interval = setInterval(
                this._sendSyncQuery,
                opts?.frequency ?? FREQUENCY
            )

        this._channel.addListener(this._onMessage)
    }

    dispose() {
        if (this._interval)
            clearInterval(this._interval)

        this._channel.removeListener(this._onMessage)
    }

    private _sendSyncQuery = () => {
        this._query = {
            i: this._queryIndex++,
            localTimestamp: Date.now()
        }

        this._channel.post(Address.host(), [
            TimeSynchronizerMessageType.Query,
            this._query.i
        ])
    }

    private _onMessage = (message: Message<TimeSynchronizerMessage>) => {
        switch (message.data[0]) {
            case TimeSynchronizerMessageType.Query:
                this._onQuery(message.originId, message.data[1])
                break
            case TimeSynchronizerMessageType.Response:
                this._onResponse(message.data[1], message.data[2])
                break
        }
        message.originId
    }

    private _onQuery(originId: string, index: number) {
        if (!this._host)
            return

        this._channel.post(Address.to(originId), [
            TimeSynchronizerMessageType.Response,
            index,
            Date.now()
        ])
    }

    private _onResponse(index: number, timestamp: number) {
        if (!this._host || !this._query || this._query.i !== index)
            return

        // TODO: maybe look for a better way to estimate the travel time
        // (take into account the time it takes to process the message)
        const t0 = this._query.localTimestamp
        const t1 = Date.now()
        const th = timestamp

        const estimatedTravelTime = (t1 - t0) / 2
        const estimatedRemoteTimestamp = th + estimatedTravelTime
        const estimatedDelta = estimatedRemoteTimestamp - t1

        this._time.setDelta(estimatedDelta)
    }

}