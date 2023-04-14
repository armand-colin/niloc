import { Template } from "../../lib/sync/Template";
import { SyncObject } from "../../lib/sync/SyncObject";
import { AnyField } from "../../lib/sync/field/AnyField";
import { describe, it } from "vitest";
import { MockModel } from "./MockModel";
import { SyncObjectRefField } from "../../lib/sync/field/SyncObjectRefField"
import { SyncObjectField } from "../../lib/sync/field/SyncObjectField"

class Tree extends SyncObject {

    static template = Template.create<Tree>("tree", Tree)

    name = new AnyField<string>("")

}

class Color extends SyncObject {

    static template = Template.create<Color>("color", Color)

    value = new AnyField<string>('#ffffff')

}

class Fruit extends SyncObject {

    static template = Template.create<Fruit>("fruit", Fruit)

    tree = new SyncObjectRefField<Tree>(null)
    name = new AnyField<string>("")
    color = new SyncObjectField<Color>(Color.template)

}

describe("Sync / Model", () => {

    it("Should create objects", () => {
        const [modelA, modelB] = MockModel.models([Tree.template, Fruit.template, Color.template])

        const tree = modelA.instantiate(Tree.template, 'mainTree')
        tree.name.set('Georges')

        const fruit = modelA.instantiate(Fruit.template, 'apple')
        fruit.tree.set(tree)
        fruit.name.set("apple")
        fruit.color.get().value.set('#ff0000')

        modelA.tick()

        console.log(SyncObject.toString(fruit))
        console.log(SyncObject.toString(modelB.get('apple')!))
    })

    it('Should handle changes', () => {
        const [modelA, modelB] = MockModel.models([Color.template])

        const red = modelA.instantiate(Color.template, 'red')
        modelA.tick()

        console.log(SyncObject.toString(modelB.get('red')!))

        red.value.set('#ff0000')
        modelA.tick()

        console.log(SyncObject.toString(modelB.get('red')!))
    })

    it('Should handle changes on subfields', () => {        
        class Test extends SyncObject {
            static template = Template.create<Test>("t", Test)
            color = new SyncObjectField(Color.template, "color")
        }

        class TestWrapper extends SyncObject {
            static template = Template.create<TestWrapper>("twr", TestWrapper)
            test = new SyncObjectField(Test.template, "test")
        }

        const [modelA, modelB] = MockModel.models([Color.template, Test.template, TestWrapper.template])

        const wrapper = modelA.instantiate(TestWrapper.template, 'wrapper')
        modelA.tick()

        console.log(SyncObject.toString(modelB.get('wrapper')!))

        wrapper.test.get().color.get().value.set('#ff0000')
        modelA.tick()

        console.log(SyncObject.toString(modelB.get('wrapper')!))
    })

})