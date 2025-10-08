import { Component } from "./Component";
import { Entity } from "./Entity";

export class Bundle {

    private _parent: Entity | null
    private _components: Component[]

    constructor(
        readonly entity: Entity,
        parent: Entity | null,
        components: Component[]
    ) {
        this._parent = parent
        this._components = components
    }

    get parent(): Entity | null {
        return this._parent
    }

}