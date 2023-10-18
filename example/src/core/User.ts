import { SyncObject, field } from "@niloc/core";

export class User extends SyncObject {

    @field.any("anonymous")
    name!: string

    @field.any({ x: 0, y: 0})
    position!: { x: number, y: number }

}