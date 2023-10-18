import { rpc } from "@niloc/core";
import { Framework } from "./Framework";
import { SignalValue } from "./SignalValue";

export type ChatMessage = {
    userId: string,
    message: string
}

export class Chat {

    readonly messages: SignalValue<ChatMessage[]>

    constructor(readonly framework: Framework) {
        framework.rpcHandler.infuse(this, "$chat")

        this.messages = new SignalValue([] as ChatMessage[])
    }

    send(message: string) {
        this.onMessage({
            userId: this.framework.router.id(),
            message
        })
    }

    @rpc.all()
    onMessage(message: ChatMessage) {
        this.messages.set([
            ...this.messages.get(),
            message
        ])
    }

}