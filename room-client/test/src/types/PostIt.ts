import { Authority, SyncObject } from "@niloc/core";
import { field } from "@niloc/core";

export class PostIt extends SyncObject {

    authority: Authority = Authority.All

    @field.string()
    title!: string

    @field.string()
    content!: string

}