import { Reader } from "../Reader";
import { Writer } from "../Writer";
import { Field } from "./Field";

enum ChangeType {
    Push,
    Pop,
    Set,
    Clear
} 

type Change<T> = {
    type: ChangeType.Push,
    values: T[]
} | {
    type: ChangeType.Pop,
    n: number
} | {
    type: ChangeType.Set,
    index: number,
    value: T
} | {
    type: ChangeType.Clear
}

class ChangeStack<T> {

    private _changes: Change<T>[] = []

    private get last(): Change<T> | undefined { 
        return this._changes[this._changes.length - 1] 
    }

    private *_reverse() {
        for (let i = this._changes.length - 1; i > -1; i--) {
            yield this._changes[i]
        }
    }

    push(...values: T[]) {
        const last = this.last
        if (last) {
            if (last.type === ChangeType.Push) {
                last.values.push(...values)
                return
            }
        }

        this._changes.push({ type: ChangeType.Push, values })
    }

    pop() {
        const last = this.last
        if (last) {
            if (last.type === ChangeType.Push) {
                this._changes.pop()
                return
            }
            if (last.type === ChangeType.Pop) {
                last.n++
                return
            }
        }

        this._changes.push({ type: ChangeType.Pop, n: 1 })
    }

    set(index: number, value: T) {
        for (const change of this._reverse()) {
            if (change.type !== ChangeType.Set)
                break
            if (change.index === index) {
                change.value = value
                return
            }
        }

        this._changes.push({ type: ChangeType.Set, index, value })
    }

    clear() {
        this._changes = []
        this._changes.push({ type: ChangeType.Clear })
    }

    write(writer: Writer) {
        writer.writeInt(this._changes.length)
        for (const change of this._changes) {
            writer.writeInt(change.type)
            switch (change.type) {
                case ChangeType.Push:
                    writer.writeInt(change.values.length)
                    for (const value of change.values) {
                        writer.writeJSON(value)
                    }
                    break
                case ChangeType.Pop:
                    writer.writeInt(change.n)
                    break
                case ChangeType.Set:
                    writer.writeInt(change.index)
                    writer.writeJSON(change.value)
                    break
            }
        }
    }

    read(reader: Reader, array: T[]) {
        const n = reader.readInt()
        for (let i = 0; i < n; i++) {
            const type = reader.readInt()
            switch (type) {
                case ChangeType.Push:
                    const m = reader.readInt()
                    for (let j = 0; j < m; j++)
                        array.push(reader.readJSON())
                    break
                case ChangeType.Pop:
                    const n = reader.readInt()
                    for (let j = 0; j < n; j++)
                        array.pop()
                    break
                case ChangeType.Set:
                    const index = reader.readInt()
                    array[index] = reader.readJSON()
                    break
                case ChangeType.Clear:
                    array.splice(0, array.length)
                    break
            }
        }
    }

    reset() {
        this._changes = []
    }

}

export class ArrayField<T> extends Field {

    private _value: T[]

    private _changes = new ChangeStack<T>()

    constructor(initValue: T[]) {
        super()
        this._value = initValue
    }

    get(): ReadonlyArray<T> { return this._value }

    push(...values: T[]) {
        this._value.push(...values)
        this._changes.push(...values)
        this.changed()
    }

    pop(): T | null {
        const value = this._value.pop()
        if (value) {
            this._changes.pop()
            this.changed()
        }
        return value ?? null
    }

    set(array: T[]) {
        this._value = array
        this._changes.clear()
        this._changes.push(...array)
        this.changed()
    }

    setAt(index: number, value: T) {
        if (index < 0 || index >= this._value.length) 
            throw new Error("Index out of range")

        this._value[index] = value
        this._changes.set(index, value)

        this.changed()
    }

    clear() {
        if (this._value.length === 0)
            return
        this._value = []
        this._changes.clear()
        this.changed()
    }

    read(reader: Reader): void {
        this._value = reader.readJSON()
        this.emitter().emit('changed')
    }

    write(writer: Writer): void {
        writer.writeJSON(this._value)
    }

    readChange(reader: Reader): void {
        this._changes.read(reader, this._value)
        this.changed()
    }

    writeChange(writer: Writer): void {
        this._changes.write(writer)
    }

    clearChange(): void {
        this._changes.reset()
    }

}