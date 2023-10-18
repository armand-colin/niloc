import { onCleanup } from "solid-js"
import { ChatView } from "./components/chat/ChatView"
import { Framework } from "./core/Framework"
import { UsersView } from "./components/users/UsersView"

export function App() {
    const search = new URLSearchParams(window.location.search)
    const name = search.get("name")
    const id = search.get("id")

    if (!name || !id) {
        const name = prompt("Enter your name")
        const i = Math.random().toString(36).substring(7)
        window.location.search = `?name=${name}&id=${i}`
        return
    }

    const framework = new Framework({
        host: false,
        peerId: id,
        roomId: "example",
        socketioUrl: "http://localhost:3456",
        name,
    })

    onCleanup(() => framework.destroy())

    return <>
        <ChatView framework={framework} />
        <UsersView framework={framework} />
    </>
}