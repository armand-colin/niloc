import { Channel, Context, Message } from "../../lib/main"
import { Model } from "../../lib/sync/Model"
import { SyncObjectType } from "../../lib/sync/SyncObjectType"

export namespace MockModel {

    export function channels(idA: string, idB: string): [Channel<any>, Channel<any>] {
        const aListeners = [] as any[]
        const bListeners = [] as any[]

        const a: Channel<any> = {
            addListener: (callback) => { aListeners.push(callback) },
            post: (address, message) => {
                const _message: Message<any> = {
                    address,
                    data: message,
                    originId: idA
                }
                for (const listener of bListeners)
                    listener(_message)
            },
            removeListener: (_callback) => { },
        }

        const b: Channel<any> = {
            addListener: (callback) => { bListeners.push(callback) },
            post: (address, message) => {
                const _message: Message<any> = {
                    address,
                    data: message,
                    originId: idB
                }
                for (const listener of aListeners)
                    listener(_message)
            },
            removeListener: (_callback) => { },
        }

        return [a, b]
    }

    export function models(types?: SyncObjectType[]): [Model, Model] {
        const [channelA, channelB] = channels("a", "b")
        
        const modelA = new Model({
            channel: channelA,
            context: new Context("a", false)
        })

        const modelB = new Model({
            channel: channelB,
            context: new Context("b", false)
        })

        for (const type of types ?? []) {
            modelA.register(type)
            modelB.register(type)
        }

        return [modelA, modelB]
    }

}