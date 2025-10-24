export interface Vec2 {
    readonly x: number,
    readonly y: number
}

function create(x: number, y: number): Vec2 {
    return { x, y }
}

function add(a: Vec2, b: Vec2): Vec2 {
    return create(a.x + b.x, a.y + b.y)
}

function subtract(a: Vec2, b: Vec2): Vec2 {
    return create(a.x - b.x, a.y - b.y)
}

function scale(v: Vec2, scalar: number): Vec2 {
    return create(v.x * scalar, v.y * scalar)
}

function dot(a: Vec2, b: Vec2): number {
    return a.x * b.x + a.y * b.y
}

function length(v: Vec2): number {
    return Math.sqrt(dot(v, v))
}

function normalize(v: Vec2): Vec2 {
    const len = length(v)
    if (len === 0) {
        throw new Error("Cannot normalize a zero-length vector")
    }
    return scale(v, 1 / len)
}

function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    return create(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t
    )
}

export const Vec2 = {
    create,
    add,
    subtract,
    scale,
    dot,
    length,
    normalize,
    lerp
}