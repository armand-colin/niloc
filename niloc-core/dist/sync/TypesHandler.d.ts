import { SyncObject } from "./SyncObject";
import { SyncObjectType } from "./SyncObjectType";
export declare class TypesHandler {
    private _templates;
    private _reverseTemplates;
    register(type: SyncObjectType, id?: string): void;
    getTypeId(object: SyncObject): string | null;
    getType(id: string): SyncObjectType | null;
}
