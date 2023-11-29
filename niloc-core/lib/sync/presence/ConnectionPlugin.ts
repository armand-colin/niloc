import { Address } from "../../main";
import { Model } from "../Model.interface";
import { Plugin } from "../Plugin";
import { ConnectionList } from "./ConnectionList";

export class ConnectionPlugin implements Plugin {

    private _model: Model | null = null

    constructor(connectionList: ConnectionList) {
        connectionList.emitter().on('connected', this._onConnected)
        connectionList.emitter().on('sync', this._onSync)
    }

    init(model: Model): void {
        this._model = model
    }

    private _onConnected = (userId: string) => {
        if (!this._model)
            return
        this._model.syncTo(Address.to(userId))
    }

    private _onSync = () => {
        if (!this._model)
            return
        this._model.syncTo(Address.broadcast())
    }

}