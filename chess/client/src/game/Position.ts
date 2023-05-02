import { AnyField, SyncObject, Template } from "niloc-core";

export class Position extends SyncObject {

    static template = Template.create("Position", Position)

    private readonly _x = new AnyField(0)
    private readonly _y = new AnyField(0)

    get x() { return this._x.get() }
    set x(value: number) { this._x.set(value) }
    
    get y() { return this._y.get() }
    set y(value: number) { this._y.set(value) }

}