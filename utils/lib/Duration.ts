export type Duration = { milliseconds: number }

export namespace Duration {

    export type Split = {
        milliseconds: number,
        seconds: number,
        minutes: number,
        hours: number,
        days: number
    }

    export function fromSplit(split: Partial<Split>): Duration {
        const milliseconds = split?.milliseconds ?? 0
        const seconds = split?.seconds ?? 0
        const minutes = split?.minutes ?? 0
        const hours = split?.hours ?? 0
        const days = split?.days ?? 0

        return {
            milliseconds: milliseconds +
                (seconds * 1000) +
                (minutes * 1000 * 60) +
                (hours * 1000 * 60 * 60) +
                (days * 1000 * 60 * 60 * 24)
        }
    }

    export function fromMilliseconds(milliseconds: number): Duration {
        return { milliseconds }
    }

    export function fromSeconds(seconds: number): Duration {
        return { milliseconds: seconds * 1000 }
    }

    export function fromMinutes(minutes: number): Duration {
        return { milliseconds: minutes * 60 * 1000 }
    }

    export function fromHours(hours: number): Duration {
        return { milliseconds: hours * 60 * 60 * 1000 }
    }

    export function fromDays(days: number): Duration {
        return { milliseconds: days * 24 * 60 * 60 * 1000 }
    }

    export function milliseconds(duration: Duration) {
        return duration.milliseconds
    }

    export function seconds(duration: Duration) {
        return duration.milliseconds / 1000
    }

    export function minutes(duration: Duration) {
        return duration.milliseconds / (1000 * 60)
    }

    export function hours(duration: Duration) {
        return duration.milliseconds / (1000 * 60 * 60)
    }

    export function days(duration: Duration) {
        return duration.milliseconds / (1000 * 60 * 60 * 24)
    }

    export function split(duration: Duration): Split {
        let time = duration.milliseconds

        const milliseconds = time % 1000
        time = (time - milliseconds) / 1000

        const seconds = time % 60
        time = (time - seconds) / 60

        const minutes = time % 60
        time = (time - minutes) / 60

        const hours = time % 24
        time = (time - hours) / 24

        const days = time

        return {
            milliseconds,
            seconds,
            minutes,
            hours,
            days
        }
    }

    export function add(first: Duration, other: Duration): Duration {
        return { milliseconds: first.milliseconds + other.milliseconds }
    }

    export function subtract(a: Duration, b: Duration): Duration {
        return { milliseconds: a.milliseconds - b.milliseconds }
    }

    export function equals(a: Duration, b: Duration): boolean {
        return a.milliseconds === b.milliseconds
    }

}