import { For } from "solid-js"
import { State } from "../state/State"
import { User } from "../core/User"
import { useField } from "../core/useField"

export const UserList = () => {
    const users = State.presence.useUsers()

    return <div class="UserList">
        <h1>Users</h1>
        <For each={users()}>
            {user => <UserView user={user} />}
        </For>
    </div>
}

const UserView = (props: { user: User }) => {
    const name = useField(props.user.name)
    const color = useField(props.user.color)

    return <div
        class="UserView"
        style={{
            "--color": color()
        }}
    >
        <span class="UserView__color"></span>
        <p>{name()}</p>
    </div>
}