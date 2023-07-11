import { Authority, SyncObject, Template, field } from "@niloc/core";

export class User extends SyncObject {

    static readonly template = Template.create("user", User, Authority.own())

    readonly position = field.any({ x: 0, y: 0 })
    readonly name = field.any("anonymous")

}