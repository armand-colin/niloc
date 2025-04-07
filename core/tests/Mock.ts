import { NetworkMessageHandler } from "../lib/core/Network";
import { Emitter, Framework, Identity, Message, Network, User } from "../lib/main";

export namespace Mock {

    class MockNetwork implements Network {

        constructor(readonly userId: string) { }

        readonly emitter = new Emitter<{
            message: { channel: number, message: Message },
            send: { channel: number, message: Message }
        }>()

        send(channel: number, message: Message): void {
            if (message.originId !== this.userId)
                return

            this.emitter.emit('send', { channel, message })
        }

        onMessage(callback: NetworkMessageHandler): void {
            this.emitter.on('message', (event) => callback(event.channel, event.message))
        }

        receive(channel: number, message: Message) {
            this.emitter.emit('message', { channel, message })
        }

    }

    export function pair(): [Framework, Framework] {
        const aNetwork = new MockNetwork("a")
        const bNetwork = new MockNetwork("b")

        aNetwork.emitter.on('send', (data) => {
            bNetwork.receive(data.channel, data.message)
        })

        bNetwork.emitter.on('send', (data) => {
            aNetwork.receive(data.channel, data.message)
        })

        const a = new Framework({
            identity: new Identity("a"),
            network: aNetwork,
            userType: User,
        })

        const b = new Framework({
            identity: new Identity("b"),
            network: bNetwork,
            userType: User,
        })

        return [a, b]
    }

}