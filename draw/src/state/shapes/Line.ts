import { SyncObject, Template } from "@niloc/core";
import { field } from "@niloc/core"

export class Line extends SyncObject {

    static readonly template = Template.create("line", Line)

    readonly color = field.any("color")
    readonly points = field.any<number[]>([])

}