import { Emitter, Message, Model, Template } from "niloc-core";
import { Channel } from "niloc-core/dist/channel/DataChannel";

export namespace MockModels {

    interface MockChannel extends Channel<any> {
        listeners(): ((message: Message<any>) => void)[]
        bind(channel: MockChannel): void
    }

    function channel(id: string): MockChannel {
        const listeners: ((message: Message<any>) => void)[] = []
        let other: MockChannel | null = null

        const channel: MockChannel = {
            addListener(callback) {
                listeners.push(callback)
            },
            removeListener(callback) {
                const index = listeners.indexOf(callback)
                if (index > -1)
                    listeners.splice(index, 1)
            },
            post(address, message) {
                if (!other)
                    return
                for (const callback of other.listeners())
                    callback({
                        address,
                        data: message,
                        originId: id
                    })
            },
            listeners() {
                return listeners
            },
            bind(channel) {
                other = channel
            }
        }

        return channel
    }

    function channels(): [Channel<any>, Channel<any>] {
        const channelA = channel("a")
        const channelB = channel("b")

        channelA.bind(channelB)
        channelB.bind(channelA)

        return [channelA, channelB]
    }

    export function mock(...templates: Template<any>[]): [Model, Model] {
        const models = channels().map(channel => new Model({ channel })) as [Model, Model]
        models.forEach(model => {
            for (const template of templates)
                model.register(template)
        })
        return models
    }

}