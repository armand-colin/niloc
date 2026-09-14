export interface Vec2 {
    readonly x: number,
    readonly y: number
}

export namespace Vec2 {

    export function create(x: number, y: number): Vec2 {
        return { x, y }
    }

    export function add(a: Vec2, b: Vec2): Vec2 {
        return create(a.x + b.x, a.y + b.y)
    }

    export function subtract(a: Vec2, b: Vec2): Vec2 {
        return create(a.x - b.x, a.y - b.y)
    }

    export function scale(v: Vec2, scalar: number): Vec2 {
        return create(v.x * scalar, v.y * scalar)
    }

    export function dot(a: Vec2, b: Vec2): number {
        return a.x * b.x + a.y * b.y
    }

    export function length(v: Vec2): number {
        return Math.sqrt(dot(v, v))
    }

    export function sqLength(v: Vec2): number {
        return dot(v, v)
    }

    export function normalize(v: Vec2): Vec2 {
        const len = length(v)
        if (len === 0) {
            throw new Error("Cannot normalize a zero-length vector")
        }
        return scale(v, 1 / len)
    }

    export function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
        return create(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        )
    }

}