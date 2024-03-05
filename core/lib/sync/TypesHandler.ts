import { SyncObject } from "./SyncObject";
import { SyncObjectType } from "./SyncObjectType";

export class TypesHandler {

    private _templates = new Map<string, SyncObjectType>()
    private _reverseTemplates = new Map<SyncObjectType, string>()

    register(type: SyncObjectType, id?: string) {
        id = id ?? type.name

        this._templates.set(id, type)
        this._reverseTemplates.set(type, id)
    }

    getTypeId(object: SyncObject): string | null {
        return this._reverseTemplates.get(object.constructor as any) ?? null
    }

    getType(id: string): SyncObjectType | null {
        return this._templates.get(id) ?? null
    }

}