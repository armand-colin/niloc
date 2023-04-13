import { test } from "@jest/globals";
import { Model } from "../../sync/Model"
import { Channel } from "../../channel/DataChannel";
import { Template } from "../../sync/Template";
import { UnsafeReader } from "../../sync/unsafe/UnsafeReader";
import { UnsafeWriter } from "../../sync/unsafe/UnsafeWriter";
import { SyncObject } from "../../sync/SyncObject";
import { AnyField } from "../../sync/field/AnyField";

class Fruit extends SyncObject {

    static template = Template.create<Fruit>("type", Fruit)

    public name = new AnyField<string>("")
    public age = new AnyField<number>(0)

}

test("Sync / Model", () => {

    const channel: Channel<any> = {
        addListener: (_callback) => { },
        post: (address, message) => { console.log(address, message) },
        removeListener: (_callback) => { },
    }

    const model = new Model({
        channel,
        reader: new UnsafeReader(),
        writer: new UnsafeWriter()
    })

    model.instantiate(Fruit.template);

    model.tick()

})