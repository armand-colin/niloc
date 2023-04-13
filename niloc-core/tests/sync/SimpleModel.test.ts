import { Model } from "../../lib/sync/Model"
import { Channel } from "../../lib/channel/DataChannel";
import { Template } from "../../lib/sync/Template";
import { UnsafeReader } from "../../lib/sync/unsafe/UnsafeReader";
import { UnsafeWriter } from "../../lib/sync/unsafe/UnsafeWriter";
import { SyncObject } from "../../lib/sync/SyncObject";
import { AnyField } from "../../lib/sync/field/AnyField";
import { describe, it } from "vitest";

class Fruit extends SyncObject {

    static template = Template.create<Fruit>("type", Fruit)

    public name = new AnyField<string>("")
    public age = new AnyField<number>(0)

}

describe("Sync / Model", () => {

    it("Should be done", () => {
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

})