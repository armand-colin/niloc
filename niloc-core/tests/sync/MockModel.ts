import { Channel } from "../../lib/channel/DataChannel"
import { Message } from "../../lib/main"
import { Model } from "../../lib/sync/Model"
import { Template } from "../../lib/sync/Template"
import { SyncReader } from "../../lib/sync/unsafe/SyncReader"
import { SyncWriter } from "../../lib/sync/unsafe/SyncWriter"
import { ChangeReader } from "../../lib/sync/unsafe/ChangeReader"
import { ChangeWriter } from "../../lib/sync/unsafe/ChangeWriter"

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

    export function models(templates?: Template<any>[]): [Model, Model] {
        const [channelA, channelB] = channels("a", "b")

        const modelA = new Model({
            channel: channelA,
            sync: {
                reader: new SyncReader(),
                writer: new SyncWriter(),
            },
            change: {
                reader: new ChangeReader(),
                writer: new ChangeWriter(),
            }
        })

        const modelB = new Model({
            channel: channelB,
            sync: {
                reader: new SyncReader(),
                writer: new SyncWriter(),
            },
            change: {
                reader: new ChangeReader(),
                writer: new ChangeWriter(),
            }
        })

        for (const template of templates ?? []) {
            modelA.register(template)
            modelB.register(template)
        }

        return [modelA, modelB]
    }

}