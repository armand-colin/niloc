import { For, createEffect, createMemo } from "solid-js"
import { State } from "../state/State"
import "./Canvas.scss"
import { User } from "../core/User"
import { useField } from "../core/useField"
import { Line } from "../state/shapes/Line"
import { useObjects } from "../core/useObjects"
import { useArrayField } from "../core/useArrayField"

export const Canvas = () => {
    const presence = State.presence
    let canvas: HTMLDivElement | null = null
    const users = presence.useUsers()
    const lines = useObjects(State.model, Line.template)

    createEffect(() => { console.log(lines()) })

    let line: Line | null = null

    function onMouseDown(e: MouseEvent) {
        if (!canvas)
            return

        const rect = canvas.getBoundingClientRect()
        line = State.model.instantiate(Line.template)

        line.points.push(e.clientX - rect.left, e.clientY - rect.top)
        State.model.tick()
    }

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

        if (!line)
            return

        const points = line.points.get()
        if (points.length < 2)
            return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const px = points[points.length - 2]
        const py = points[points.length - 1]

        const sqDistance = (x - px) ** 2 + (y - py) ** 2

        if (sqDistance < 25)
            return
        
        line.points.push(e.clientX - rect.left, e.clientY - rect.top)
        State.model.tick()
    }

    function onMouseUp() {
        console.log(line?.points.get().length)
        line = null
    }

    return <div
        class="Canvas"
        ref={element => canvas = element}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
    >
        <For each={users()}>
            {user => <Cursor
                user={user}
            />}
        </For>
        <svg>
            <For each={lines()}>
                {line => <LineView
                    line={line}
                />}
            </For>
        </svg>

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

const LineView = (props: { line: Line }) => {
    const color = useField(props.line.color)
    const points = useArrayField(props.line.points)

    const path = createMemo(() => {
        let path = ""

        const currentPoints = points()
        if (currentPoints.length < 4)
            return path

        path += `M ${currentPoints[0]} ${currentPoints[1]} `

        for (let i = 2; i < currentPoints.length; i += 2)
            path += `L ${points()[i]} ${points()[i + 1]} `

        return path
    })

    return <path
        d={path()}
        fill="transparent"
        class="Line"
        style={{
            "--color": color()
        }}
    />

}