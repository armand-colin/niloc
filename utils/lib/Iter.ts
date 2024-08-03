type Zipped<T extends any[]> = 
    T extends [] ? [] :
    T extends [Iterable<infer A>, ...(infer Rest)] ? [A, ...Zipped<Rest>] : 
    never

type Predicate<T, U extends T> = (value: T) => value is U

export class Iter<T> implements Iterable<T> {

    private readonly _iterable: Iterable<T>

    static from<T>(iterable: Iterable<T>): Iter<T> {
        return new Iter<T>(iterable)
    }

    static range(size: number): Iter<number> {
        return new Iter<number>(range(size))
    }

    static zip<T extends Iterable<any>[]>(...iters: T): Iter<Zipped<T>> {
        return new Iter<Zipped<T>>(zip(iters))
    }

    static enumerate<T>(iterable: Iterable<T>): Iter<[number, T]> {
        return new Iter<[number, T]>(enumerate(iterable))
    }

    constructor(iterable: Iterable<T>) {
        this._iterable = iterable
    }
    
    filter(predicate: (value: T) => boolean): Iter<T>
    filter<U extends T>(predicate: Predicate<T, U>): Iter<U>

    filter<U extends T = T>(predicate: Predicate<T, U>): Iter<U> {
        return new Iter<U>(filter(this._iterable, predicate))
    }

    map<U>(mapping: (value: T) => U): Iter<U> {
        return new Iter<U>(map(this._iterable, mapping))
    }

    enumerate(): Iter<[number, T]> {
        return new Iter<[number, T]>(enumerate(this._iterable))
    }

    collect(): T[] {
        return Array.from(this._iterable)
    }

    [Symbol.iterator]() {
        return this._iterable[Symbol.iterator]()
    }

}

function *filter<T, U extends T>(iterable: Iterable<T>, predicate: Predicate<T, U>) {
    for (const value of iterable) {
        if (predicate(value)) {
            yield value
        }
    }
}

function *map<T, U>(iterable: Iterable<T>, mapping: (value: T) => U) {
    for (const value of iterable) {
        yield mapping(value)
    }
}

function *range(size: number) {
    for (let i = 0; i < size; i++) {
        yield i
    }
}

function *zip<T extends Iterable<any>[]>(iterables: T): Iterable<Zipped<T>> {
    const table = new Array(iterables.length).fill(null)

    const iterators = iterables.map(iterable => iterable[Symbol.iterator]())

    while (true) {
        for (let i = 0; i < iterables.length; i++) {
            const iterator = iterators[i]
            const result = iterator.next()

            if (result.done)
                return
            
            table[i] = result.value
        }

        yield table as Zipped<T>
    }
}

function *enumerate<T>(iterable: Iterable<T>): Iterable<[number, T]> {
    let i = 0
    const table = new Array(2).fill(null)

    for (const value of iterable) {
        table[0] = i
        table[1] = value
        yield table as [number, T]
        i++
    }
}