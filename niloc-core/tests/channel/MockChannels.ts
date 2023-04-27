import { Channel, DataChannel } from "../../lib/channel/DataChannel";

export namespace MockChannels {
    
    export function bounded(channel = 0): [Channel<any>, Channel<any>] {
        const dataChannelA = new DataChannel(channel)
        const dataChannelB = new DataChannel(channel)

        dataChannelA.output().setListener((address, message) => dataChannelB.output().post({ address, data: message, originId: 'a' }))
        dataChannelB.output().setListener((address, message) => dataChannelA.output().post({ address, data: message, originId: 'b' }))

        return [dataChannelA.input(), dataChannelB.input()]
    }

}