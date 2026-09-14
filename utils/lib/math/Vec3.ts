export interface Vec3 {
    readonly x: number,
    readonly y: number,
    readonly z: number
}

export namespace Vec3 {

    export function create(x: number, y: number, z: number): Vec3 {
        return { x, y, z }
    }

    export function add(a: Vec3, b: Vec3): Vec3 {
        return create(a.x + b.x, a.y + b.y, a.z + b.z)
    }

    export function subtract(a: Vec3, b: Vec3): Vec3 {
        return create(a.x - b.x, a.y - b.y, a.z - b.z)
    }

    export function scale(v: Vec3, scalar: number): Vec3 {
        return create(v.x * scalar, v.y * scalar, v.z * scalar)
    }

    export function dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z
    }

    export function length(v: Vec3): number {
        return Math.sqrt(dot(v, v))
    }

    export function sqLength(v: Vec3): number {
        return dot(v, v)
    }

    export function normalize(v: Vec3): Vec3 {
        const len = length(v)
        if (len === 0) {
            throw new Error("Cannot normalize a zero-length vector")
        }
        return scale(v, 1 / len)
    }

    export function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
        return create(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t
        )
    }

}