export interface AnimationCurve {

    sample(t: number): number

}

export namespace AnimationCurve {

    export const Linear = {
        sample(t: number): number {
            return t
        }
    }

    export const EaseIn = {
        sample(t: number): number {
            return t * t
        }
    }

    export const EaseOut = {
        sample(t: number): number {
            return t * (2 - t)
        }
    }

    export const EaseInOut = {
        sample(t: number): number {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        }
    }

}