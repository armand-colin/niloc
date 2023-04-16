import { AnyField, SyncObject, Template } from "niloc-core";

export class Position extends SyncObject {

    static template = Template.create("Position", Position)

    readonly x = new AnyField(0)
    readonly y = new AnyField(0)

}