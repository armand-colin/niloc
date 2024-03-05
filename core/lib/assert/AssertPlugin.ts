import { Identity } from "../core/Identity"
import { SyncObject } from "../sync/SyncObject"
import { Plugin } from "../sync/Plugin"
import { AssertHandler } from "./AssertHandler"

export class AssertPlugin implements Plugin {

    private _handler: AssertHandler

    constructor(identity: Identity) {
        this._handler = new AssertHandler(identity)
    }

    beforeCreate<T extends SyncObject>(object: T): void {
        this._handler.infuse(object)
    }

}