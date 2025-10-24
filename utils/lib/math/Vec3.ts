export interface Vec3 {
    readonly x: number,
    readonly y: number,
    readonly z: number
}

function create(x: number, y: number, z: number): Vec3 {
    return { x, y, z }
}

function add(a: Vec3, b: Vec3): Vec3 {
    return create(a.x + b.x, a.y + b.y, a.z + b.z)
}

function subtract(a: Vec3, b: Vec3): Vec3 {
    return create(a.x - b.x, a.y - b.y, a.z - b.z)
}

function scale(v: Vec3, scalar: number): Vec3 {
    return create(v.x * scalar, v.y * scalar, v.z * scalar)
}

function dot(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z
}

function length(v: Vec3): number {
    return Math.sqrt(dot(v, v))
}

function normalize(v: Vec3): Vec3 {
    const len = length(v)
    if (len === 0) {
        throw new Error("Cannot normalize a zero-length vector")
    }
    return scale(v, 1 / len)
}

function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
    return create(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
    )
}

export const Vec3 = {
    create,
    add,
    subtract,
    scale,
    dot,
    length,
    normalize,
    lerp
}