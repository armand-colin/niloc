import { For } from "solid-js";
import { Chat, ChatMessage } from "../../core/Chat";
import { Framework } from "../../core/Framework";

export function ChatView(props: { framework: Framework }) {
    const chat = new Chat(props.framework)

    function onSend(message: string) {
        chat.send(message)
    }

    return <div class="ChatView">
        <For each={chat.messages.get()}>
            {message => <ChatMessageView
                framework={props.framework}
                message={message}
            />}
        </For>

        <ChatForm onSubmit={onSend} />
    </div>
}

function ChatMessageView(props: { message: ChatMessage, framework: Framework }) {
    
    const user = props.framework.presence.users()
        .find(user => user.id() === props.message.userId)

    const name = user ?
        user.name :
        props.message.userId

    return <div class="ChatMessageView">
        {name}: {props.message.message}
    </div>
}

function ChatForm(props: {
    onSubmit: (message: string) => void,
}) {
    let inputRef: HTMLInputElement | undefined = undefined

    function onSubmit(e: Event) {
        e.preventDefault()
        if (!inputRef)
            return
        const message = inputRef.value.trim()

        if (!message)
            return

        props.onSubmit(message)
        inputRef.value = ""
    }

    return <form onSubmit={onSubmit}>
        <input type="text" ref={inputRef} />
        <button type="submit">Send</button>
    </form>
}