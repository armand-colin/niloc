type Split = {
    milliseconds: number,
    seconds: number,
    minutes: number,
    hours: number,
    days: number
}

export class Duration {

    constructor(readonly milliseconds: number) { }

    static split(split: Partial<Split>) {
        const milliseconds = split?.milliseconds ?? 0
        const seconds = split?.seconds ?? 0
        const minutes = split?.minutes ?? 0
        const hours = split?.hours ?? 0
        const days = split?.days ?? 0

        return new Duration(
            milliseconds +
            (seconds * 1000) +
            (minutes * 1000 * 60) +
            (hours * 1000 * 60 * 60) +
            (days * 1000 * 60 * 60 * 24)
        )
    }

    static milliseconds(milliseconds: number) {
        return new Duration(milliseconds)
    }

    static seconds(seconds: number) {
        return new Duration(seconds * 1000)
    }

    static minutes(minutes: number) {
        return new Duration(minutes * 60 * 1000)
    }

    static hours(hours: number) {
        return new Duration(hours * 60 * 60 * 1000)
    }

    static days(days: number) {
        return new Duration(days * 24 * 60 * 60 * 1000)
    }

    get seconds() {
        return this.milliseconds / 1000
    }

    get minutes() {
        return this.milliseconds / (1000 * 60)
    }

    get hours() {
        return this.milliseconds / (1000 * 60 * 60)
    }

    get days() {
        return this.milliseconds / (1000 * 60 * 60 * 24)
    }

    split(): Split {
        let time = this.milliseconds

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

    add(other: Duration) {
        return new Duration(this.milliseconds + other.milliseconds)
    }

    subtract(other: Duration) {
        return new Duration(this.milliseconds - other.milliseconds)
    }

    equals(other: Duration) {
        return this.milliseconds === other.milliseconds
    }

}