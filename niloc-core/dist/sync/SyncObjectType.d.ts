import { SyncObject } from "./SyncObject";
export type SyncObjectType<T extends SyncObject = SyncObject> = {
    new (id: string): T;
};
