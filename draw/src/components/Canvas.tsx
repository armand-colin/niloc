import { For } from "solid-js"
import { State } from "../state/State"
import "./Canvas.scss"
import { User } from "../core/User"
import { useField } from "../core/useField"

export const Canvas = () => {
    const presence = State.instance.presence
    let canvas: HTMLDivElement | null = null
    const users = presence.useUsers()

    function onMouseMove(e: MouseEvent) {
        if (!canvas)
            return

        const rect = canvas.getBoundingClientRect()
        const user = presence.user()

        user.position.set({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top 
        })

        presence.tick()
    }

    return <div
        class="Canvas"
        onMouseMove={onMouseMove}
        ref={element => canvas = element}
    >
        <For each={users()}>
            {user => <Cursor
                user={user}
            />}
        </For>
    </div>
}

const Cursor = (props: { user: User }) => {
    const position = useField(props.user.position)
    const name = useField(props.user.name)
    const color = useField(props.user.color)

    return <div
        class="Cursor"
        style={{
            "--left": position().x.toString(),
            "--top": position().y.toString(),
            "--color": color()
        }}
    >
        <p>{name()}</p>
    </div>
}