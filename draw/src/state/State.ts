import { Presence } from "../core/Presence";

export class State {

    private static _instance: State | null = null
    static get instance() {
        if (this._instance === null)
            throw new Error("State not initialized")

        return this._instance
    }

    static initialize(presence: Presence) {
        this._instance = new State(presence)
    }

    private constructor(presence: Presence) {
        this.presence = presence
    }


    readonly presence: Presence

}