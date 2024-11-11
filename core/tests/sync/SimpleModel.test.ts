import { SyncObject } from "../../lib/sync/SyncObject";
import { AnyField } from "../../lib/sync/field/AnyField";
import { describe, expect, it } from "vitest";
import { MockModel } from "./MockModel";
import { SyncObjectRefField } from "../../lib/sync/field/SyncObjectRefField"

class Tree extends SyncObject {

    name = new AnyField<string>("")

}

class Color extends SyncObject {

    value = new AnyField<string>('#ffffff')

}

class Fruit extends SyncObject {

    tree = new SyncObjectRefField<Tree>(null)
    name = new AnyField<string>("")

}

describe("Sync / Model", () => {

    it("Should handle simple object creation", () => {
        const [modelA, modelB] = MockModel.models([Color])

        const red = modelA.instantiate(Color, 'red')
        red.value.set('#ff0000')
        modelA.send()

        expect(modelB.get('red')).not.to.be.null
        expect(modelB.get<Color>('red')?.value.get()).to.equal("#ff0000")
    })

    it("Should handle simple object change", () => {
        const [modelA, modelB] = MockModel.models([Color])

        const red = modelA.instantiate(Color, 'red')
        modelA.send()

        expect(modelB.get('red')).not.to.be.null;
        expect(modelB.get<Color>('red')?.value.get()).to.equal("#ffffff");

        red.value.set("#ff0000")
        modelA.send()

        expect(modelB.get<Color>('red')?.value.get()).to.equal("#ff0000");
    })

    it("Should hande reference", () => {
        const [modelA, modelB] = MockModel.models([Fruit, Tree])

        const appleTree = modelA.instantiate(Tree, "appleTree")
        appleTree.name.set("My apple tree")

        const apple = modelA.instantiate(Fruit, "apple")
        apple.name.set("Granny Smith")
        apple.tree.set(appleTree)

        modelA.send()

        {
            const apple = modelB.get<Fruit>("apple")
            expect(apple).not.to.be.null
            expect(apple?.name.get()).to.equal("Granny Smith")

            const tree = apple?.tree.get()
            expect(tree).not.to.be.null
            expect(tree?.name.get()).to.equal("My apple tree")
            expect(tree?.id).to.equal("appleTree")
        }
    })

    it("Should hande reference change", () => {
        const [modelA, modelB] = MockModel.models([Fruit, Tree])

        const appleTree = modelA.instantiate(Tree, "appleTree")
        appleTree.name.set("My apple tree")
        
        const pearTree = modelA.instantiate(Tree, "pearTree")
        pearTree.name.set("My pear tree")

        const apple = modelA.instantiate(Fruit, "apple")
        apple.name.set("Granny Smith")
        modelA.send()

        {
            const apple = modelB.get<Fruit>('apple')
            const tree = apple?.tree.get()
            expect(tree).be.null
        }

        apple.tree.set(appleTree)
        modelA.send()

        {
            const apple = modelB.get<Fruit>('apple')
            const tree = apple?.tree.get()
            expect(tree).not.be.null
            expect(tree?.name.get()).to.equal("My apple tree")
            expect(tree?.id).to.equal("appleTree")
        }

        apple.tree.set(pearTree)
        modelA.send()

        {
            const apple = modelB.get<Fruit>('apple')
            const tree = apple?.tree.get()
            expect(tree).not.be.null
            expect(tree?.name.get()).to.equal("My pear tree")
            expect(tree?.id).to.equal("pearTree")
        }
    })
})