import { Bundle } from "./Bundle";
import { Component } from "./Component";
import { Entity } from "./Entity";

type SpawnOptions = {
    components?: Component[]
    children?: SpawnOptions[]
}

export class Scene {

    private _root: Entity = 0
    private _bundles: Bundle[] = []
    private _entityCounter = 1

    constructor() {
        this._root = 0
    }

    spawn(options: SpawnOptions): Entity {
        return this._spawn(this._root, options).entity
    }

    private _spawn(parent: Entity | null, options: SpawnOptions): Bundle {
        const entity: Entity = this._entityCounter++

        const bundle = new Bundle(entity, parent, options.components ?? [])
        this._bundles[entity] = bundle

        return bundle
    }

}