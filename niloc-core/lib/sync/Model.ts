import { Template } from "./Template"
import { SyncObject } from "./SyncObject"

export interface Model {

    instantiate<T extends SyncObject>(template: Template<T>): T

}

export class Model {

    instantiate<T extends SyncObject>(template: Template<T>): T {
        const object = template.create()
        return object
    }

}